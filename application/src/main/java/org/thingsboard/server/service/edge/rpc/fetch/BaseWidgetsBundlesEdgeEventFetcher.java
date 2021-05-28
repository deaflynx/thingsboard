/**
 * Copyright © 2016-2021 The Thingsboard Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package org.thingsboard.server.service.edge.rpc.fetch;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.thingsboard.server.common.data.edge.Edge;
import org.thingsboard.server.common.data.edge.EdgeEvent;
import org.thingsboard.server.common.data.edge.EdgeEventActionType;
import org.thingsboard.server.common.data.edge.EdgeEventType;
import org.thingsboard.server.common.data.id.TenantId;
import org.thingsboard.server.common.data.page.PageData;
import org.thingsboard.server.common.data.page.PageLink;
import org.thingsboard.server.common.data.widget.WidgetsBundle;
import org.thingsboard.server.dao.widget.WidgetsBundleService;
import org.thingsboard.server.service.edge.rpc.EdgeEventUtils;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@AllArgsConstructor
public abstract class BaseWidgetsBundlesEdgeEventFetcher extends BasePageableEdgeEventFetcher {

    protected final WidgetsBundleService widgetsBundleService;

    @Override
    public PageData<EdgeEvent> fetchEdgeEvents(TenantId tenantId, Edge edge, PageLink pageLink) {
        log.trace("[{}] start fetching edge events [{}]", tenantId, edge.getId());
        PageData<WidgetsBundle> pageData = findWidgetsBundles(tenantId, pageLink);
        List<EdgeEvent> result = new ArrayList<>();
        if (!pageData.getData().isEmpty()) {
            for (WidgetsBundle widgetsBundle : pageData.getData()) {
                result.add(EdgeEventUtils.constructEdgeEvent(tenantId, edge.getId(), EdgeEventType.WIDGETS_BUNDLE,
                        EdgeEventActionType.ADDED, widgetsBundle.getId(), null));
            }
        }
        return new PageData<>(result, pageData.getTotalPages(), pageData.getTotalElements(), pageData.hasNext());
    }

    protected abstract PageData<WidgetsBundle> findWidgetsBundles(TenantId tenantId, PageLink pageLink);
}