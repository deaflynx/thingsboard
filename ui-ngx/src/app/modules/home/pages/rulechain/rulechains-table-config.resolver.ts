///
/// Copyright © 2016-2020 The Thingsboard Authors
///
/// Licensed under the Apache License, Version 2.0 (the "License");
/// you may not use this file except in compliance with the License.
/// You may obtain a copy of the License at
///
///     http://www.apache.org/licenses/LICENSE-2.0
///
/// Unless required by applicable law or agreed to in writing, software
/// distributed under the License is distributed on an "AS IS" BASIS,
/// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
/// See the License for the specific language governing permissions and
/// limitations under the License.
///

import {Injectable} from '@angular/core';

import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  Resolve,
  Router
} from '@angular/router';
import {
  checkBoxCell,
  DateEntityTableColumn,
  EntityTableColumn,
  EntityTableConfig, HeaderActionDescriptor
} from '@home/models/entity/entities-table-config.models';
import {TranslateService} from '@ngx-translate/core';
import {DatePipe} from '@angular/common';
import {EntityType, entityTypeResources, entityTypeTranslations} from '@shared/models/entity-type.models';
import {EntityAction} from '@home/models/entity/entity-component.models';
import {edgeRuleChainType, RuleChain, systemRuleChainType} from '@shared/models/rule-chain.models';
import {RuleChainService} from '@core/http/rule-chain.service';
import {RuleChainComponent} from '@modules/home/pages/rulechain/rulechain.component';
import {DialogService} from '@core/services/dialog.service';
import { RuleChainTabsComponent } from '@home/pages/rulechain/rulechain-tabs.component';
import { ImportExportService } from '@home/components/import-export/import-export.service';
import { ItemBufferService } from '@core/services/item-buffer.service';
import {isUndefined} from "@core/utils";
import {
  ManageRuleChainEdgesActionType,
  ManageRuleChainEdgesDialogComponent,
  ManageRuleChainEdgesDialogData
} from "@home/pages/rulechain/manage-rulechain-edges-dialog.component";

import {MatDialog} from "@angular/material/dialog";
import {
  AddEntitiesToEdgeDialogComponent,
  AddEntitiesToEdgeDialogData
} from "@home/dialogs/add-entities-to-edge-dialog.component";
import {Browser} from "leaflet";
import edge = Browser.edge;

@Injectable()
export class RuleChainsTableConfigResolver implements Resolve<EntityTableConfig<RuleChain>> {

  private readonly config: EntityTableConfig<RuleChain> = new EntityTableConfig<RuleChain>();
  private edgeId: string;

  constructor(private ruleChainService: RuleChainService,
              private dialogService: DialogService,
              private importExport: ImportExportService,
              private itembuffer: ItemBufferService,
              private translate: TranslateService,
              private datePipe: DatePipe,
              private router: Router,
              private dialog: MatDialog) {

    this.config.entityType = EntityType.RULE_CHAIN;
    this.config.entityComponent = RuleChainComponent;
    this.config.entityTabsComponent = RuleChainTabsComponent;
    this.config.entityTranslations = entityTypeTranslations.get(EntityType.RULE_CHAIN);
    this.config.entityResources = entityTypeResources.get(EntityType.RULE_CHAIN);

    this.config.columns.push(
      new DateEntityTableColumn<RuleChain>('createdTime', 'rulechain.created-time', this.datePipe, '150px'),
      new EntityTableColumn<RuleChain>('name', 'rulechain.name', '100%'),
      new EntityTableColumn<RuleChain>('root', 'rulechain.root', '60px',
        entity => {
          return checkBoxCell(entity.root);
        }),
    );

    this.config.cellActionDescriptors.push(
      {
        name: this.translate.instant('rulechain.open-rulechain'),
        icon: 'settings_ethernet',
        isEnabled: () => true,
        onAction: ($event, entity) => this.openRuleChain($event, entity)
      },
      {
        name: this.translate.instant('rulechain.export'),
        icon: 'file_download',
        isEnabled: () => true,
        onAction: ($event, entity) => this.exportRuleChain($event, entity)
      },
      {
        name: this.translate.instant('rulechain.set-root'),
        icon: 'flag',
        isEnabled: (ruleChain) => (!ruleChain.root && ruleChain.type === systemRuleChainType),
        onAction: ($event, entity) => this.setRootRuleChain($event, entity)
      },
      {
        name: this.translate.instant('rulechain.manage-assigned-edges'),
        icon: 'wifi_tethering',
        isEnabled: (ruleChain) => (ruleChain.type === edgeRuleChainType),
        onAction: ($event, entity) => this.manageAssignedEdges($event, entity)
      },
      {
        name: this.translate.instant('rulechain.set-default-root-edge'),
        icon: 'flag',
        isEnabled: (ruleChain) => (!ruleChain.root && ruleChain.type === edgeRuleChainType),
        onAction: ($event, entity) => this.setDefaultRootEdgeRuleChain($event, entity)
      },
    );

    this.config.deleteEntityTitle = ruleChain => this.translate.instant('rulechain.delete-rulechain-title',
      {ruleChainName: ruleChain.name});
    this.config.deleteEntityContent = () => this.translate.instant('rulechain.delete-rulechain-text');
    this.config.deleteEntitiesTitle = count => this.translate.instant('rulechain.delete-rulechains-title', {count});
    this.config.deleteEntitiesContent = () => this.translate.instant('rulechain.delete-rulechains-text');
    this.config.onEntityAction = action => this.onRuleChainAction(action);

    this.config.loadEntity = id => this.ruleChainService.getRuleChain(id.id);
    this.config.saveEntity = ruleChain => this.saveRuleChain(ruleChain);
    this.config.deleteEntity = id => this.ruleChainService.deleteRuleChain(id.id);
    this.config.deleteEnabled = (ruleChain) => ruleChain && !ruleChain.root;
    this.config.entitySelectionEnabled = (ruleChain) => ruleChain && !ruleChain.root;
  }

  resolve(route: ActivatedRouteSnapshot): EntityTableConfig<RuleChain> {
    const routeParams = route.params;
    this.config.componentsData = {
      ruleChainsScope: route.data.ruleChainsScope,
      ruleChainsType: routeParams.type
    };

    let ruleChainsScope = this.config.componentsData.ruleChainsScope;
    this.edgeId = routeParams.edgeId;
    this.config.addActionDescriptors = this.configureAddActions(ruleChainsScope);
    if (ruleChainsScope === 'tenant') {
      this.config.tableTitle = this.translate.instant('rulechain.system-rulechains');
      this.config.entitiesFetchFunction = pageLink => this.ruleChainService.getRuleChains(pageLink, systemRuleChainType);
    }
    if (ruleChainsScope === 'edges') {
      this.config.tableTitle = this.translate.instant('rulechain.edge-rulechains');
      this.config.entitiesFetchFunction = pageLink => this.ruleChainService.getRuleChains(pageLink, edgeRuleChainType);
    }
    if (ruleChainsScope === 'edge') {
      this.config.tableTitle = this.translate.instant('rulechain.edge-rulechains');
      this.config.entitiesFetchFunction = pageLink => this.ruleChainService.getEdgeRuleChains(this.edgeId, pageLink);
    }
    return this.config;
  }

  configureAddActions(ruleChainsScope: string): Array<HeaderActionDescriptor> {
    const actions: Array<HeaderActionDescriptor> = [];
    if (ruleChainsScope === 'tenant') {
      actions.push(
        {
          name: this.translate.instant('rulechain.create-new-rulechain'),
            icon: 'insert_drive_file',
          isEnabled: () => true,
          onAction: ($event) => this.config.table.addEntity($event)
        },
        {
          name: this.translate.instant('rulechain.import'),
            icon: 'file_upload',
          isEnabled: () => true,
          onAction: ($event) => this.importRuleChain($event)
        }
      )
    }
    if (ruleChainsScope === 'edges') {
      actions.push(
        {
          name: this.translate.instant('rulechain.create-new-edge-rulechain'),
          icon: 'insert_drive_file',
          isEnabled: () => true,
          onAction: ($event) => this.config.table.addEntity($event)
        },
        {
          name: this.translate.instant('rulechain.import-edge'),
          icon: 'file_upload',
          isEnabled: () => true,
          onAction: ($event) => this.importRuleChain($event)
        }
      )
    }
    if (ruleChainsScope === 'edge') {
      actions.push(
        {
          name: this.translate.instant('rulechain.assign-new-rulechain'),
          icon: 'add',
          isEnabled: () => true,
          onAction: ($event) => this.addRuleChainsToEdge($event)
        }
      )
    }
    return actions;
  }

  addRuleChainsToEdge($event: Event) {
    if ($event) {
      $event.stopPropagation();
    }
    this.dialog.open<AddEntitiesToEdgeDialogComponent, AddEntitiesToEdgeDialogData,
      boolean>(AddEntitiesToEdgeDialogComponent, {
      disableClose: true,
      panelClass: ['tb-dialog', 'tb-fullscreen-dialog'],
      data: {
        edgeId: this.edgeId,
        entityType: EntityType.RULE_CHAIN
      }
    }).afterClosed()
      .subscribe((res) => {
        if (res) {
          this.config.table.updateData();
        }
      });
  }

  importRuleChain($event: Event) {
    if ($event) {
      $event.stopPropagation();
    }
    this.importExport.importRuleChain().subscribe((ruleChainImport) => {
      if (ruleChainImport) {
        this.itembuffer.storeRuleChainImport(ruleChainImport);
        this.router.navigateByUrl(`${this.router.url}/ruleChain/import`);
      }
    });
  }

  openRuleChain($event: Event, ruleChain: RuleChain) {
    if ($event) {
      $event.stopPropagation();
    }
    this.router.navigateByUrl(`ruleChains/${ruleChain.type.toLowerCase()}/${ruleChain.id.id}`);
  }

  saveRuleChain(ruleChain: RuleChain) {
    if (isUndefined(ruleChain.type)) {
      if (this.config.componentsData.ruleChainsScope == 'edges') {
        ruleChain.type = edgeRuleChainType
      } else {
        ruleChain.type = systemRuleChainType
      }
    }
    return this.ruleChainService.saveRuleChain(ruleChain);
  }

  exportRuleChain($event: Event, ruleChain: RuleChain) {
    if ($event) {
      $event.stopPropagation();
    }
    this.importExport.exportRuleChain(ruleChain.id.id);
  }

  setRootRuleChain($event: Event, ruleChain: RuleChain) {
    if ($event) {
      $event.stopPropagation();
    }
    this.dialogService.confirm(
      this.translate.instant('rulechain.set-root-rulechain-title', {ruleChainName: ruleChain.name}),
      this.translate.instant('rulechain.set-root-rulechain-text'),
      this.translate.instant('action.no'),
      this.translate.instant('action.yes'),
      true
    ).subscribe((res) => {
        if (res) {
          this.ruleChainService.setRootRuleChain(ruleChain.id.id).subscribe(
            () => {
              this.config.table.updateData();
            }
          );
        }
      }
    );
  }

  onRuleChainAction(action: EntityAction<RuleChain>): boolean {
    switch (action.action) {
      case 'open':
        this.openRuleChain(action.event, action.entity);
        return true;
      case 'export':
        this.exportRuleChain(action.event, action.entity);
        return true;
      case 'setRoot':
        this.setRootRuleChain(action.event, action.entity);
        return true;
    }
    return false;
  }

  manageAssignedEdges($event: Event, ruleChain: RuleChain) {
    const assignedEdgesIds = ruleChain.assignedEdges ?
      ruleChain.assignedEdges.map(
        edgeInfo => edgeInfo.edgeId.id,
        type => type.edge.type
      ) : [];
    this.showManageAssignedEdgesDialog($event, [ruleChain.id.id], 'manage', assignedEdgesIds);
  }

  showManageAssignedEdgesDialog($event: Event, ruleChainIds: Array<string>,
                                actionType: ManageRuleChainEdgesActionType,
                                assignedEdgesIds?: Array<string>) {
    if ($event) {
      $event.stopPropagation();
    }
    this.dialog.open<ManageRuleChainEdgesDialogComponent, ManageRuleChainEdgesDialogData,
      boolean>(ManageRuleChainEdgesDialogComponent, {
      disableClose: true,
      panelClass: ['tb-dialog', 'tb-fullscreen-dialog'],
      data: {
        ruleChainIds,
        actionType,
        assignedEdgesIds
      }
    }).afterClosed()
      .subscribe((res) => {
        if (res) {
          this.config.table.updateData();
        }
      });
  }

  setDefaultRootEdgeRuleChain($event: Event, ruleChain: RuleChain) {
    if ($event) {
      $event.stopPropagation();
    }
    this.dialogService.confirm(
      this.translate.instant('rulechain.set-default-root-edge-rulechain-title', {ruleChainName: ruleChain.name}),
      this.translate.instant('rulechain.set-default-root-edge-rulechain-text'),
      this.translate.instant('action.no'),
      this.translate.instant('action.yes'),
      true
    ).subscribe((res) => {
        if (res) {
          this.ruleChainService.setDefaultRootEdgeRuleChain(ruleChain.id.id).subscribe(
            () => {
              this.config.table.updateData();
            }
          );
        }
      }
    );
  }



}
