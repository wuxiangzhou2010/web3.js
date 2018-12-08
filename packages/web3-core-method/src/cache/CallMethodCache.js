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
 * @file CallMethodCache.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

export default class CallMethodCache {
    /**
     * Get cached method from localStorage
     *
     * @method getItem
     *
     * @param {AbstractMethod} method
     *
     * @returns {Boolean}
     */
    getItem(method) {
        const methodCall = JSON.parse(window.localStorage.getItem('Web3Calls')).find(methodCall => {
            return methodCall.method.rpcMethod === method.rpcMethod
                && methodCall.method.parameters === method.parameters;
        });

        return methodCall ? methodCall.response : false;
    }

    /**
     * Add method and response to localStorage
     *
     * @method addItem
     *
     * @param {AbstractMethod} method
     * @param {any} response
     */
    addItem(method, response) {
        const now = new Date().getTime();
        const oneMonth = 2592000000;

        const filteredMethodCalls = this.methodCalls.filter(methodCall => {
            return methodCall.timestamp >= (now - oneMonth);
        });

        window.localStorage.setItem(
            'Web3Calls',
            JSON.stringify(
                filteredMethodCalls.push(
                    {
                        method: method,
                        response: response,
                        timestamp: now
                    }
                )
            )
        );
    }
}
