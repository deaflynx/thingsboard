/*
 * Copyright © 2016-2020 The Thingsboard Authors
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
import './edges-hierarchy-widget.scss';

/* eslint-disable import/no-unresolved, import/default */

import edgesHierarchyWidgetTemplate from './edges-hierarchy-widget.tpl.html';

/* eslint-enable import/no-unresolved, import/default */

export default angular.module('thingsboard.widgets.edgesHierarchyWidget', [])
    .directive('tbEdgesHierarchyWidget', EdgesHierarchyWidget)
    .name;
/* eslint-disable no-unused-vars, no-undef */
/*@ngInject*/
function EdgesHierarchyWidget() {
    return {
        restrict: "E",
        scope: true,
        bindToController: {
            hierarchyId: '=',
            ctx: '='
        },
        controller: EdgesHierarchyWidgetController,
        controllerAs: 'vm',
        templateUrl: edgesHierarchyWidgetTemplate
    };
}

/*@ngInject*/
function EdgesHierarchyWidgetController($element, $scope, $q, $timeout, toast, types, entityService, entityRelationService,
                                           assetService, deviceService, entityViewService, dashboardService, ruleChainService,
                                           edgeService, $translate /*$filter, $mdMedia, $mdPanel, $document, $translate, $timeout, utils, types*/) {
    var vm = this;

    vm.showData = true;

    vm.nodeEditCallbacks = {};

    vm.nodeIdCounter = 0;

    vm.nodesMap = {};
    vm.entityGroupNodesMap = {};
    vm.parentIdToGroupAllNodeId = {};
    vm.edgeGroupsNodesMap = {};

    vm.pendingUpdateNodeTasks = {};

    vm.query = {
        search: null
    };

    vm.searchAction = {
        name: 'action.search',
        show: true,
        onAction: function() {
            vm.enterFilterMode();
        },
        icon: 'search'
    };

    vm.onNodesInserted = onNodesInserted;
    vm.onNodeSelected = onNodeSelected;
    vm.enterFilterMode = enterFilterMode;
    vm.exitFilterMode = exitFilterMode;
    vm.searchCallback = searchCallback;

    $scope.$watch('vm.ctx', function() {
        if (vm.ctx && vm.ctx.defaultSubscription) {
            vm.settings = vm.ctx.settings;
            vm.widgetConfig = vm.ctx.widgetConfig;
            vm.subscription = vm.ctx.defaultSubscription;
            vm.datasources = vm.subscription.datasources;
            initializeConfig();
            updateDatasources();
        }
    });

    $scope.$watch("vm.query.search", function(newVal, prevVal) {
        if (!angular.equals(newVal, prevVal) && vm.query.search != null) {
            updateSearchNodes();
        }
    });

    $scope.$on('edges-hierarchy-data-updated', function(event, hierarchyId) {
        if (vm.hierarchyId == hierarchyId) {
            if (vm.subscription) {
                updateNodeData(vm.subscription.data);
            }
        }
    });

    function initializeConfig() {

        vm.ctx.widgetActions = [ vm.searchAction ];

        var testNodeCtx = {
            entity: {
                id: {
                    entityType: 'DEVICE',
                    id: '123'
                },
                name: 'TEST DEV1'
            },
            data: {},
            level: 2
        };
        var parentNodeCtx = angular.copy(testNodeCtx);
        parentNodeCtx.level = 1;
        testNodeCtx.parentNodeCtx = parentNodeCtx;

        var nodeRelationQueryFunction = loadNodeCtxFunction(vm.settings.nodeRelationQueryFunction, 'nodeCtx', testNodeCtx);
        var nodeIconFunction = loadNodeCtxFunction(vm.settings.nodeIconFunction, 'nodeCtx', testNodeCtx);
        var nodeTextFunction = loadNodeCtxFunction(vm.settings.nodeTextFunction, 'nodeCtx', testNodeCtx);
        var nodeDisabledFunction = loadNodeCtxFunction(vm.settings.nodeDisabledFunction, 'nodeCtx', testNodeCtx);
        var nodeOpenedFunction = loadNodeCtxFunction(vm.settings.nodeOpenedFunction, 'nodeCtx', testNodeCtx);
        var nodeHasChildrenFunction = loadNodeCtxFunction(vm.settings.nodeHasChildrenFunction, 'nodeCtx', testNodeCtx);

        var testNodeCtx2 = angular.copy(testNodeCtx);
        testNodeCtx2.entity.name = 'TEST DEV2';

        var nodesSortFunction = loadNodeCtxFunction(vm.settings.nodesSortFunction, 'nodeCtx1,nodeCtx2', testNodeCtx, testNodeCtx2);

        vm.nodeRelationQueryFunction = nodeRelationQueryFunction || defaultNodeRelationQueryFunction;
        vm.nodeIconFunction = nodeIconFunction || defaultNodeIconFunction;
        vm.nodeTextFunction = nodeTextFunction || ((nodeCtx) => nodeCtx.entity.name);
        vm.nodeDisabledFunction = nodeDisabledFunction || (() => false);
        vm.nodeOpenedFunction = nodeOpenedFunction || defaultNodeOpenedFunction;
        vm.nodeHasChildrenFunction = nodeHasChildrenFunction || (() => true);
        vm.nodesSortFunction = nodesSortFunction || defaultSortFunction;
    }

    function loadNodeCtxFunction(functionBody, argNames, ...args) {
        var nodeCtxFunction = null;
        if (angular.isDefined(functionBody) && functionBody.length) {
            try {
                nodeCtxFunction = new Function(argNames, functionBody);
                var res = nodeCtxFunction.apply(null, args);
                if (angular.isUndefined(res)) {
                    nodeCtxFunction = null;
                }
            } catch (e) {
                nodeCtxFunction = null;
            }
        }
        return nodeCtxFunction;
    }

    function enterFilterMode () {
        vm.query.search = '';
        vm.ctx.hideTitlePanel = true;
        $timeout(()=>{
            angular.element(vm.ctx.$container).find('.searchInput').focus();
        })
    }

    function exitFilterMode () {
        vm.query.search = null;
        updateSearchNodes();
        vm.ctx.hideTitlePanel = false;
    }

    function searchCallback (searchText, node) {
        var theNode = vm.nodesMap[node.id];
        if (theNode && theNode.data.searchText) {
            return theNode.data.searchText.includes(searchText.toLowerCase());
        }
        return false;
    }

    function updateDatasources() {
        vm.loadNodes = loadNodes;
    }

    function updateSearchNodes() {
        if (vm.query.search != null) {
            vm.nodeEditCallbacks.search(vm.query.search);
        } else {
            vm.nodeEditCallbacks.clearSearch();
        }
    }

    function onNodesInserted(nodes/*, parent*/) {
        if (nodes) {
            nodes.forEach((nodeId) => {
                var task = vm.pendingUpdateNodeTasks[nodeId];
                if (task) {
                    task();
                    delete vm.pendingUpdateNodeTasks[nodeId];
                }
            });
        }
    }

    function onNodeSelected(node, event) {
        var nodeId;
        if (!node) {
            nodeId = -1;
        } else {
            nodeId = node.id;
        }
        if (nodeId !== -1) {
            var selectedNode = vm.nodesMap[nodeId];
            if (selectedNode) {
                var descriptors = vm.ctx.actionsApi.getActionDescriptors('nodeSelected');
                if (descriptors.length) {
                    var entity = selectedNode.data.nodeCtx.entity;
                    vm.ctx.actionsApi.handleWidgetAction(event, descriptors[0], entity.id, entity.name, { nodeCtx: selectedNode.data.nodeCtx });
                }
            }
        }
    }

    function updateNodeData(subscriptionData) {
        var affectedNodes = [];
        if (subscriptionData) {
            for (var i=0;i<subscriptionData.length;i++) {
                var datasource = subscriptionData[i].datasource;
                if (datasource.nodeId) {
                    var node = vm.nodesMap[datasource.nodeId];
                    var key = subscriptionData[i].dataKey.label;
                    var value = undefined;
                    if (subscriptionData[i].data && subscriptionData[i].data.length) {
                        value = subscriptionData[i].data[0][1];
                    }
                    if (node.data.nodeCtx.data[key] !== value) {
                        if (affectedNodes.indexOf(datasource.nodeId) === -1) {
                            affectedNodes.push(datasource.nodeId);
                        }
                        node.data.nodeCtx.data[key] = value;
                    }
                }
            }
        }
        affectedNodes.forEach((nodeId) => {
            var node = vm.nodeEditCallbacks.getNode(nodeId);
            if (node) {
                updateNodeStyle(vm.nodesMap[nodeId]);
            } else {
                vm.pendingUpdateNodeTasks[nodeId] = () => {
                    updateNodeStyle(vm.nodesMap[nodeId]);
                };
            }
        });
    }

    function updateNodeStyle(node) {
        var newText = prepareNodeText(node);
        if (!angular.equals(node.text, newText)) {
            node.text = newText;
            vm.nodeEditCallbacks.updateNode(node.id, node.text);
        }
        var newDisabled = vm.nodeDisabledFunction(node.data.nodeCtx);
        if (!angular.equals(node.state.disabled, newDisabled)) {
            node.state.disabled = newDisabled;
            if (node.state.disabled) {
                vm.nodeEditCallbacks.disableNode(node.id);
            } else {
                vm.nodeEditCallbacks.enableNode(node.id);
            }
        }
        var newHasChildren = vm.nodeHasChildrenFunction(node.data.nodeCtx);
        if (!angular.equals(node.children, newHasChildren)) {
            node.children = newHasChildren;
            vm.nodeEditCallbacks.setNodeHasChildren(node.id, node.children);
        }
    }

    function prepareNodeText(node) {
        var nodeIcon = prepareNodeIcon(node.data.nodeCtx);
        var nodeText = vm.nodeTextFunction(node.data.nodeCtx);
        node.data.searchText = nodeText ? nodeText.replace(/<[^>]+>/g, '').toLowerCase() : "";
        return nodeIcon + nodeText;
    }

    function loadNodes(node, cb) {
        var parentEntityGroupId;
        if (node.id === '#') {
            edgeService.getEdges({limit:100}, null).then(
                (edges) => {
                    cb(edgesToNodes(node.id, null, edges.data));
                }
            )
        }
        else if (node.data.type === "edge") {
            var edge = node.data.entity;
            parentEntityGroupId = node.data.parentEntityGroupId;
            cb(loadNodesForEdge(node.id, parentEntityGroupId, edge));
        } else if (node.data.type === "groups") {
            parentEntityGroupId = node.data.parentEntityGroupId;
            var promise;
            switch (node.data.groupType) {
                case (types.entityType.asset):
                    promise = assetService.getEdgeAssets(node.data.edge.id.id, {limit: 100}, null);
                    break;
                case (types.entityType.device):
                    promise = deviceService.getEdgeDevices(node.data.edge.id.id, {limit: 100}, null);
                    break;
                case (types.entityType.entityView):
                    promise = entityViewService.getEdgeEntityViews(node.data.edge.id.id, {limit: 100}, null);
                    break;
                case (types.entityType.rulechain):
                    promise = ruleChainService.getEdgeRuleChains(node.data.edge.id.id, {limit: 100}, null);
                    break;
                case (types.entityType.dashboard):
                    promise = dashboardService.getEdgeDashboards(node.data.edge.id.id, {limit: 100}, null);
                    break;
            }
            promise.then(
                (entityGroups) => {
                    if (entityGroups.data.length) {
                        cb(edgesToNodes(node.id, parentEntityGroupId, entityGroups.data));
                    } else {
                        cb([]);
                    }
                }
            )
        }
    }

    var groupTypes = [
        types.entityType.asset,
        types.entityType.device,
        types.entityType.entityView,
        types.entityType.rulechain,
        types.entityType.dashboard
    ];

    function iconForGroupType(groupType) {
        switch (groupType) {
            case types.entityType.user:
                return 'tb-user-group';
            case types.entityType.customer:
                return 'tb-customer-group';
            case types.entityType.asset:
                return 'tb-asset-group';
            case types.entityType.device:
                return 'tb-device-group';
            case types.entityType.entityView:
                return 'tb-entity-view-group';
            case types.entityType.edge:
                return 'tb-edge-group';
            case types.entityType.rulechain:
                return 'tb-rule-chain-group';
            case types.entityType.dashboard:
                return 'tb-dashboard-group';
        }
        return '';
    }

    function textForGroupType(groupType) {
        switch (groupType) {
            case types.entityType.asset:
                return $translate.instant('edge.assets');
            case types.entityType.device:
                return $translate.instant('edge.devices');
            case types.entityType.entityView:
                return $translate.instant('edge.entity-views');
            case types.entityType.rulechain:
                return $translate.instant('edge.rulechains');
            case types.entityType.dashboard:
                return $translate.instant('edge.dashboards');
        }
        return '';
    }

    function loadNodesForEdge(parentNodeId, parentEntityGroupId, edge) {
        var nodes = [];
        var nodesMap = {};
        vm.edgeGroupsNodesMap[parentNodeId] = nodesMap;
        for (var i=0; i<groupTypes.length;i++) {
            var groupType = groupTypes[i];
            var node = {
                id: ++vm.nodeIdCounter,
                icon: 'material-icons ' + iconForGroupType(groupType),
                text: textForGroupType(groupType),
                children: true,
                data: {
                    type: "groups",
                    groupType: groupType,
                    edge: edge,
                    parentEntityGroupId: parentEntityGroupId,
                    internalId: edge.id.id + '_' + groupType
                }
            };
            nodes.push(node);
            nodesMap[groupType] = node.id;
        }
        return nodes;
    }

    function edgesToNodes(parentNodeId, parentEntityGroupId, entityGroups) {
        var nodes = [];
        var nodesMap = {};
        vm.entityGroupNodesMap[parentNodeId] = nodesMap;
        if (entityGroups) {
            for (var i = 0; i < entityGroups.length; i++) {
                var entityGroup = entityGroups[i];
                var node = createEntityGroupNode(parentNodeId, entityGroup, parentEntityGroupId);
                nodes.push(node);
                if (entityGroup.id.entityType === types.entityType.edge) {
                    vm.parentIdToGroupAllNodeId[parentNodeId] = node.id;
                }
            }
        }
        return nodes;
    }

    function createEntityGroupNode(parentNodeId, entityGroup, parentEntityGroupId) {
        var nodesMap = vm.entityGroupNodesMap[parentNodeId];
        if (!nodesMap) {
            nodesMap = {};
            vm.entityGroupNodesMap[parentNodeId] = nodesMap;
        }
        var node = {
            id: ++vm.nodeIdCounter,
            icon: 'material-icons ' + iconForGroupType(entityGroup.id.entityType),
            text: entityGroup.name,
            children: entityGroup.id.entityType === types.entityType.edge,
            data: {
                type: "edge",
                entity: entityGroup,
                parentEntityGroupId: parentEntityGroupId,
                internalId: entityGroup.id.id
            }
        };
        nodesMap[entityGroup.id.id] = node.id;
        return node;
    }

    function defaultNodeRelationQueryFunction(nodeCtx) {
        var entity = nodeCtx.entity;
        var query = {
            parameters: {
                rootId: entity.id.id,
                rootType: entity.id.entityType,
                direction: types.entitySearchDirection.from,
                relationTypeGroup: "COMMON",
                maxLevel: 1
            },
            filters: [
                {
                    relationType: "Contains",
                    entityTypes: []
                }
            ]
        };
        return query;
    }

    function prepareNodeIcon(nodeCtx) {
        var iconInfo = vm.nodeIconFunction(nodeCtx);
        if (iconInfo && iconInfo === 'default') {
            iconInfo = defaultNodeIconFunction(nodeCtx);
        }
        if (iconInfo && (iconInfo.iconUrl || iconInfo.materialIcon)) {
            if (iconInfo.materialIcon) {
                return materialIconHtml(iconInfo.materialIcon);
            } else {
                return iconUrlHtml(iconInfo.iconUrl);
            }
        } else {
            return "";
        }
    }

    function materialIconHtml(materialIcon) {
        return '<md-icon aria-label="'+materialIcon+'" class="node-icon material-icons" role="img" aria-hidden="false">'+materialIcon+'</md-icon>';
    }

    function iconUrlHtml(iconUrl) {
        return '<div class="node-icon" style="background-image: url('+iconUrl+');">&nbsp;</div>';
    }

    function defaultNodeIconFunction(nodeCtx) {
        var materialIcon = 'insert_drive_file';
        var entity = nodeCtx.entity;
        if (entity && entity.id && entity.id.entityType) {
            switch (entity.id.entityType) {
                case 'function':
                    materialIcon = 'functions';
                    break;
                case types.entityType.device:
                    materialIcon = 'devices_other';
                    break;
                case types.entityType.asset:
                    materialIcon = 'domain';
                    break;
                case types.entityType.tenant:
                    materialIcon = 'supervisor_account';
                    break;
                case types.entityType.customer:
                    materialIcon = 'supervisor_account';
                    break;
                case types.entityType.user:
                    materialIcon = 'account_circle';
                    break;
                case types.entityType.dashboard:
                    materialIcon = 'dashboards';
                    break;
                case types.entityType.alarm:
                    materialIcon = 'notifications_active';
                    break;
                case types.entityType.entityView:
                    materialIcon = 'view_quilt';
                    break;
                case types.entityType.edge:
                    materialIcon = 'router';
                    break;
                case types.entityType.rulechain:
                    materialIcon = 'settings_ethernet';
                    break;
            }
        }
        return {
            materialIcon: materialIcon
        };
    }

    function defaultNodeOpenedFunction(nodeCtx) {
        return nodeCtx.level <= 4;
    }

    function defaultSortFunction(nodeCtx1, nodeCtx2) {
        var result = nodeCtx1.entity.id.entityType.localeCompare(nodeCtx2.entity.id.entityType);
        if (result === 0) {
            result = nodeCtx1.entity.name.localeCompare(nodeCtx2.entity.name);
        }
        return result;
    }
}
