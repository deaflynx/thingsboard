// /*
//  * Copyright © 2016-2020 The Thingsboard Authors
//  *
//  * Licensed under the Apache License, Version 2.0 (the "License");
//  * you may not use this file except in compliance with the License.
//  * You may obtain a copy of the License at
//  *
//  *     http://www.apache.org/licenses/LICENSE-2.0
//  *
//  * Unless required by applicable law or agreed to in writing, software
//  * distributed under the License is distributed on an "AS IS" BASIS,
//  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  * See the License for the specific language governing permissions and
//  * limitations under the License.
//  */
// import './edges-overview-widget-copy.scss';
//
// /* eslint-disable import/no-unresolved, import/default */
//
// import edgesOverviewWidgetTemplate from './edges-overview-widget.tpl.html';
//
// /* eslint-enable import/no-unresolved, import/default */
//
// export default angular.module('thingsboard.widgets.edgesOverviewWidget2', [])
//     .directive('tbEdgesOverviewWidget', EdgesOverviewWidget)
//     .name;
// /* eslint-disable no-unused-vars, no-undef */
// /*@ngInject*/
// function EdgesOverviewWidget() {
//     return {
//         restrict: "E",
//         scope: true,
//         bindToController: {
//             hierarchyId: '=',
//             ctx: '='
//         },
//         controller: EdgesOverviewWidgetController,
//         controllerAs: 'vm',
//         templateUrl: edgesOverviewWidgetTemplate
//     };
// }
//
// /*@ngInject*/
// function EdgesOverviewWidgetController($element, $scope, $q, $timeout, toast, types, entityService, userService, entityRelationService,
//                                         assetService, deviceService, entityViewService, dashboardService, ruleChainService /*$filter, $mdMedia, $mdPanel, $document, $translate, $timeout, utils, types*/) {
//     var vm = this;
//
//     vm.showData = true;
//
//     vm.nodeEditCallbacks = {};
//
//     vm.nodeIdCounter = 0;
//
//     vm.nodesMap = {};
//     vm.entityGroupsNodesMap = {};
//     vm.pendingUpdateNodeTasks = {};
//
//     vm.query = {
//         search: null
//     };
//
//     vm.edgeGroupsTypes = [
//         types.entityType.asset,
//         types.entityType.device,
//         types.entityType.entityView,
//         types.entityType.dashboard,
//         types.entityType.rulechain,
//     ]
//
//     vm.onNodesInserted = onNodesInserted;
//     vm.onNodeSelected = onNodeSelected;
//
//     $scope.$watch('vm.ctx', function() {
//         if (vm.ctx && vm.ctx.defaultSubscription) {
//             vm.settings = vm.ctx.settings;
//             vm.widgetConfig = vm.ctx.widgetConfig;
//             vm.subscription = vm.ctx.defaultSubscription;
//             vm.datasources = vm.subscription.datasources;
//             updateDatasources();
//         }
//     });
//
//     $scope.$on('edges-overview-data-updated', function(event, hierarchyId) {
//         if (vm.hierarchyId == hierarchyId) {
//             if (vm.subscription) {
//                 updateNodeData(vm.subscription.data);
//             }
//         }
//     });
//
//     function updateDatasources() {
//         vm.loadNodes = loadNodes;
//     }
//
//     function onNodesInserted(nodes/*, parent*/) {
//         if (nodes) {
//             nodes.forEach((nodeId) => {
//                 var task = vm.pendingUpdateNodeTasks[nodeId];
//                 if (task) {
//                     task();
//                     delete vm.pendingUpdateNodeTasks[nodeId];
//                 }
//             });
//         }
//     }
//
//     function onNodeSelected(node, event) {
//         var nodeId;
//         if (!node) {
//             nodeId = -1;
//         } else {
//             nodeId = node.id;
//         }
//         if (nodeId !== -1) {
//             var selectedNode = vm.nodesMap[nodeId];
//             if (selectedNode) {
//                 var descriptors = vm.ctx.actionsApi.getActionDescriptors('nodeSelected');
//                 if (descriptors.length) {
//                     var entity = selectedNode.data.nodeCtx.entity;
//                     vm.ctx.actionsApi.handleWidgetAction(event, descriptors[0], entity.id, entity.name, { nodeCtx: selectedNode.data.nodeCtx });
//                 }
//             }
//         }
//     }
//
//     function updateNodeData(subscriptionData) {
//         var affectedNodes = [];
//         if (subscriptionData) {
//             for (var i=0;i<subscriptionData.length;i++) {
//                 var datasource = subscriptionData[i].datasource;
//                 if (datasource.nodeId) {
//                     var node = vm.nodesMap[datasource.nodeId];
//                     var key = subscriptionData[i].dataKey.label;
//                     var value = undefined;
//                     if (subscriptionData[i].data && subscriptionData[i].data.length) {
//                         value = subscriptionData[i].data[0][1];
//                     }
//                     if (node.data.nodeCtx.data[key] !== value) {
//                         if (affectedNodes.indexOf(datasource.nodeId) === -1) {
//                             affectedNodes.push(datasource.nodeId);
//                         }
//                         node.data.nodeCtx.data[key] = value;
//                     }
//                 }
//             }
//         }
//         affectedNodes.forEach((nodeId) => {
//             var node = vm.nodeEditCallbacks.getNode(nodeId);
//             if (node) {
//                 updateNodeStyle(vm.nodesMap[nodeId]);
//             } else {
//                 vm.pendingUpdateNodeTasks[nodeId] = () => {
//                     updateNodeStyle(vm.nodesMap[nodeId]);
//                 };
//             }
//         });
//     }
//
//     function updateNodeStyle(node) {
//         var newText = prepareNodeText(node);
//         if (!angular.equals(node.text, newText)) {
//             node.text = newText;
//             vm.nodeEditCallbacks.updateNode(node.id, node.text);
//         }
//         var newDisabled = vm.nodeDisabledFunction(node.data.nodeCtx);
//         if (!angular.equals(node.state.disabled, newDisabled)) {
//             node.state.disabled = newDisabled;
//             if (node.state.disabled) {
//                 vm.nodeEditCallbacks.disableNode(node.id);
//             } else {
//                 vm.nodeEditCallbacks.enableNode(node.id);
//             }
//         }
//         var newHasChildren = vm.nodeHasChildrenFunction(node.data.nodeCtx);
//         if (!angular.equals(node.children, newHasChildren)) {
//             node.children = newHasChildren;
//             vm.nodeEditCallbacks.setNodeHasChildren(node.id, node.children);
//         }
//     }
//
//     function prepareNodeText(node) {
//         var nodeIcon = prepareNodeIcon(node.data.nodeCtx);
//         var nodeText = vm.nodeTextFunction(node.data.nodeCtx);
//         node.data.searchText = nodeText ? nodeText.replace(/<[^>]+>/g, '').toLowerCase() : "";
//         return nodeIcon + nodeText;
//     }
//
//     function prepareEgeGroupText(node) {
//         var nodeIcon = prepareNodeIcon(node.data.nodeCtx);
//         var nodeText = "Edge rule chains";
//         node.data.searchText = nodeText ? nodeText.replace(/<[^>]+>/g, '').toLowerCase() : "";
//         return nodeIcon + nodeText;
//     }
//
//     function loadNodes(node, cb) {
//         var datasource = vm.datasources[0];
//         if (node.id === '#' && datasource) {
//             if (datasource.type === 'entity' && datasource.entity.id.entityType === types.entityType.edge) {
//                 var selectedEdge = datasource.entity;
//                 vm.ctx.widgetTitle = selectedEdge.name;
//                 cb(loadNodesForEdge(selectedEdge.id.id, selectedEdge))
//             }
//         } else {
//                 cb([]);
//         }
//     }
//
//     function loadNodesForEdge(parentNodeId, entity) {
//         var nodes = [];
//         var nodesMap = {};
//         vm.entityGroupsNodesMap[parentNodeId] = nodesMap;
//         var user = userService.getCurrentUser();
//         var allowedGroupTypes = vm.edgeGroupsTypes;
//         if (user.authority === 'CUSTOMER_USER') {
//             allowedGroupTypes = vm.edgeGroupsTypes.filter(type => type !== types.entityType.rulechain)
//         }
//         allowedGroupTypes.forEach((groupType) => {
//             var node = {
//                 id: ++vm.nodeIdCounter,
//                 icon: 'material-icons ' + iconForGroupType(groupType),
//                 text: textForGroupType(groupType),
//                 children: true,
//                 data: {
//                     groupType,
//                     entity,
//                     internalId: entity.id.id + '_' + groupType
//                 }
//             };
//             nodes.push(node);
//             nodesMap[groupType] = node.id;
//         });
//         return nodes;
//     }
//
//     function iconForGroupType(groupType) {
//         switch (groupType) {
//             case vm.types.entityType.asset:
//                 return 'tb-asset-group';
//             case vm.types.entityType.device:
//                 return 'tb-device-group';
//             case vm.types.entityType.entityView:
//                 return 'tb-entity-view-group';
//             case vm.types.entityType.dashboard:
//                 return 'tb-dashboard-group';
//             case vm.types.entityType.rulechain:
//                 return 'tb-rule-chain-group';
//         }
//         return '';
//     }
//
//     function textForGroupType(groupType) {
//         switch (groupType) {
//             case vm.types.entityType.asset:
//                 return $translate.instant('asset.assets');
//             case vm.types.entityType.device:
//                 return $translate.instant('device.devices');
//             case vm.types.entityType.entityView:
//                 return $translate.instant('entity-view.entity-views');
//             case vm.types.entityType.rulechain:
//                 return $translate.instant('rulechain.rulechains');
//             case vm.types.entityType.dashboard:
//                 return $translate.instant('dashboard.dashboards');
//         }
//         return '';
//     }
//
//     function edgeGroupsNodeText(entityType) {
//
//     }
//
//     function prepareNodes(nodes) {
//         nodes = nodes.filter((node) => node !== null);
//         nodes.sort((node1, node2) => vm.nodesSortFunction(node1.data.nodeCtx, node2.data.nodeCtx));
//         return nodes;
//     }
//
//     function datasourceToNode(datasource, parentNodeCtx) {
//         var deferred = $q.defer();
//         resolveEntity(datasource).then(
//             (entity) => {
//                 if (entity != null) {
//                     var node = {
//                         id: ++vm.nodeIdCounter
//                     };
//                     vm.nodesMap[node.id] = node;
//                     datasource.nodeId = node.id;
//                     node.icon = false;
//                     var nodeCtx = {
//                         parentNodeCtx: parentNodeCtx,
//                         entity: entity,
//                         data: {}
//                     };
//                     nodeCtx.level = parentNodeCtx ? parentNodeCtx.level + 1 : 1;
//                     node.data = {
//                         datasource: datasource,
//                         nodeCtx: nodeCtx
//                     };
//                     node.state = {
//                         disabled: vm.nodeDisabledFunction(node.data.nodeCtx),
//                         opened: vm.nodeOpenedFunction(node.data.nodeCtx)
//                     };
//                     node.text = prepareNodeText(node);
//                     node.children = vm.nodeHasChildrenFunction(node.data.nodeCtx);
//                     deferred.resolve(node);
//                 } else {
//                     deferred.resolve(null);
//                 }
//             }
//         );
//         return deferred.promise;
//     }
//
//     function edgeGroupToNode(entityType, parentDatasource, parentNodeCtx) {
//         var deferred = $q.defer();
//         deferred.resolve(getEdgeGroupNode(entityType, parentDatasource, parentNodeCtx));
//         return deferred.promise;
//     }
//
//     function getEdgeGroupNode(entityType, parentDatasource, parentNodeCtx) {
//         var datasource = {
//             dataKeys: parentDatasource.dataKeys,
//             entityId: parentDatasource.entity.id.id + '_' + entityType,
//             type: "edgeGroup",
//             entityType: entityType
//         };
//
//         var node = {
//             id: ++vm.nodeIdCounter
//         };
//         vm.nodesMap[node.id] = node;
//         datasource.nodeId = node.id;
//         node.icon = false;
//         var nodeCtx = {
//             parentNodeCtx: 3,
//             data: {},
//             entity: {
//                 id: {
//                     id: parentDatasource.entity.id.id + '_' + entityType,
//                     entityType: 'group'
//                 },
//                 name: "Edge Group RC"
//             }
//         };
//         nodeCtx.level = parentNodeCtx ? parentNodeCtx.level + 1 : 1;
//         node.data = {
//             datasource: datasource,
//             nodeCtx: nodeCtx
//         };
//         node.state = {
//             disabled: vm.nodeDisabledFunction(node.data.nodeCtx),
//             opened: vm.nodeOpenedFunction(node.data.nodeCtx)
//         };
//         node.text = prepareEgeGroupText(node);
//         node.children = vm.nodeHasChildrenFunction(node.data.nodeCtx);
//         return node;
//     }
//
//     function entityIdToEdgeGroupNode(entityType, entityId, parentDatasource, parentNodeCtx) {
//         var deferred = $q.defer();
//         var datasource = {
//             dataKeys: parentDatasource.dataKeys,
//             type: types.datasourceType.entity,
//             entityType: entityType,
//             entityId: entityId
//         };
//         datasourceToNode(datasource, parentNodeCtx).then(
//             (node) => {
//                 if (node != null) {
//                     var subscriptionOptions = {
//                         type: types.widgetType.latest.value,
//                         datasources: [datasource],
//                         callbacks: {
//                             onDataUpdated: (subscription) => {
//                                 updateNodeData(subscription.data);
//                             }
//                         }
//                     };
//                     vm.ctx.subscriptionApi.createSubscription(subscriptionOptions, true).then(
//                         (/*subscription*/) => {
//                             deferred.resolve(node);
//                         }
//                     );
//                 } else {
//                     deferred.resolve(node);
//                 }
//             }
//         );
//         return deferred.promise;
//     }
//
//     function resolveEntity(datasource) {
//         var deferred = $q.defer();
//         if (datasource.type === types.datasourceType.function) {
//             var entity = {
//                 id: {
//                     entityType: "function"
//                 },
//                 name: datasource.name
//             }
//             deferred.resolve(entity);
//         } else {
//             entityService.getEntity(datasource.entityType, datasource.entityId, {ignoreLoading: true}).then(
//                 (entity) => {
//                     deferred.resolve(entity);
//                 },
//                 () => {
//                     deferred.resolve(null);
//                 }
//             );
//         }
//         return deferred.promise;
//     }
//
//     function prepareNodeIcon(nodeCtx) {
//         var iconInfo = vm.nodeIconFunction(nodeCtx);
//         if (iconInfo && iconInfo === 'default') {
//             iconInfo = defaultNodeIconFunction(nodeCtx);
//         }
//         if (iconInfo && (iconInfo.iconUrl || iconInfo.materialIcon)) {
//             if (iconInfo.materialIcon) {
//                 return materialIconHtml(iconInfo.materialIcon);
//             } else {
//                 return iconUrlHtml(iconInfo.iconUrl);
//             }
//         } else {
//             return "";
//         }
//     }
//
//     function materialIconHtml(materialIcon) {
//         return '<md-icon aria-label="'+materialIcon+'" class="node-icon material-icons" role="img" aria-hidden="false">'+materialIcon+'</md-icon>';
//     }
//
//     function iconUrlHtml(iconUrl) {
//         return '<div class="node-icon" style="background-image: url('+iconUrl+');">&nbsp;</div>';
//     }
//
//     function defaultNodeIconFunction(nodeCtx) {
//         var materialIcon = 'insert_drive_file';
//         var entity = nodeCtx.entity;
//         if (entity && entity.id && entity.id.entityType) {
//             switch (entity.id.entityType) {
//                 case 'function':
//                     materialIcon = 'functions';
//                     break;
//                 case types.entityType.device:
//                     materialIcon = 'devices_other';
//                     break;
//                 case types.entityType.asset:
//                     materialIcon = 'domain';
//                     break;
//                 case types.entityType.tenant:
//                     materialIcon = 'supervisor_account';
//                     break;
//                 case types.entityType.customer:
//                     materialIcon = 'supervisor_account';
//                     break;
//                 case types.entityType.user:
//                     materialIcon = 'account_circle';
//                     break;
//                 case types.entityType.dashboard:
//                     materialIcon = 'dashboards';
//                     break;
//                 case types.entityType.alarm:
//                     materialIcon = 'notifications_active';
//                     break;
//                 case types.entityType.entityView:
//                     materialIcon = 'view_quilt';
//                     break;
//                 case types.entityType.edge:
//                     materialIcon = 'router';
//                     break;
//                 case types.entityType.rulechain:
//                     materialIcon = 'settings_ethernet';
//                     break;
//             }
//         }
//         return {
//             materialIcon: materialIcon
//         };
//     }
//
// }