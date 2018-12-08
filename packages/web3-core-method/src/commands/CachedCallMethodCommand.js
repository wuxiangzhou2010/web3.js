/*
    This file is part of web3.js.

    web3.js is free software: you can redistribute it and/or modify
    it under the terms of the GNU Lesser General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    web3.js is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Lesser General Public License for more details.

    You should have received a copy of the GNU Lesser General Public License
    along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
*/
/**
 * @file CachedCallMethodCommand.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

import {Observable} from 'rxjs';
import CallMethodCommand from './CallMethodCommand';

export default class CachedCallMethodCommand extends CallMethodCommand {
    /**
     * @param {Accounts} accounts
     * @param {MessageSigner} messageSigner
     * @param {CallMethodCache} callMethodCache
     *
     * @constructor
     */
    constructor(accounts, messageSigner, callMethodCache) {
        super(accounts, messageSigner);
        this.callMethodCache = callMethodCache;
    }

    /**
     * Signs the message over JSON-RPC on the connected node
     *
     * @method signOnNode
     *
     * @param {AbstractWeb3Module} moduleInstance
     * @param {AbstractMethod} method
     *
     * @returns {Observable}
     */
    async sendToNode(moduleInstance, method) {
        return new Observable.create(async observer => {
            const cachedResponse = this.callMethodCache.getItem(method);
            if (cachedResponse) {
                observer.next(cachedResponse);
            }

            try {
                let response = await moduleInstance.currentProvider.send(method.rpcMethod, method.parameters);
                response = method.afterExecution(response);

                if (method.rpcMethod !== 'eth_sign') {
                    this.callMethodCache.addItem(method, response);
                }

                observer.next(response);
            } catch (error) {
                observer.throw(error);
            }
        });
    }
}
