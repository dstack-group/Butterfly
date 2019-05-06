/**
 * @project:   Butterfly
 * @author:    DStack Group
 * @module:    middleware-dispatcher
 * @fileName:  UserManagerResponse.java
 * @created:   2019-03-07
 *
 * --------------------------------------------------------------------------------------------
 * Copyright (c) 2019 DStack Group.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * --------------------------------------------------------------------------------------------
 *
 * @description:
 */

package it.unipd.dstack.butterfly.middleware.dispatcher.model;

import java.util.List;

public class UserManagerResponse {
    private List<UserManagerResponseData> data;

    public List<UserManagerResponseData> getData() {
        return this.data;
    }
}
