import * as React from 'react';
import { PureComponent } from 'react';
import * as ReactDOM from 'react-dom';

import isNil from 'lodash-es/isNil';

import helper from '../helper';
import Pagination from '../../pagination';
import Checkbox from '../../checkbox';

export default class Foot extends PureComponent<any, any> {
  footStyleFixed: React.CSSProperties;
  batch: HTMLDivElement | null = null;

  // 拿到所有的选中的item
  renderBatchComps(selectedRows, batchComponents) {
    return batchComponents.map((comp, index) => {
      let subComponent;
      if (helper.isReactComponent(comp)) {
        const Comp = comp;
        subComponent = <Comp data={selectedRows} />;
      } else if (typeof comp === 'function') {
        subComponent = comp(selectedRows, index);
      } else {
        subComponent = comp;
      }

      return (
        <div className="subcomponent-wrapper" key={index}>
          {subComponent}
        </div>
      );
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.batchComponentsFixed) {
      this.footStyleFixed = {
        height: (ReactDOM.findDOMNode(
          this.batch
        ) as Element).getBoundingClientRect().height,
      };
    } else {
      this.footStyleFixed = {};
    }
  }

  onSelect = e => {
    let isChecked = false;
    if (e.target.checked) {
      isChecked = true;
    }

    this.props.selection.onSelectAll(isChecked);
  };

  render() {
    const { onPageChange, batchComponents, selection, current } = this.props;

    const pageInfo = this.props.pageInfo || {};
    const { totalItem, pageSize, total, limit, pageSizeOptions } = pageInfo;

    const { needSelect, selectedRows } = selection;
    let batchClassName = 'tfoot__batchcomponents';
    const shouldRenderFoot =
      (batchComponents && batchComponents.length > 0) ||
      Object.keys(pageInfo).length !== 0;

    if (batchComponents && batchComponents.length > 0) {
      batchClassName += ' tfoot__batchcomponents--has-children';
    }

    if (this.props.batchComponentsFixed) {
      batchClassName += ' tfoot__batchcomponents--fixed';
    }

    return (
      shouldRenderFoot && (
        <div className="tfoot clearfix" style={this.footStyleFixed}>
          <div className={batchClassName} ref={c => (this.batch = c)}>
            {needSelect && batchComponents && batchComponents.length > 0 && (
              <Checkbox
                className="select-check"
                onChange={this.onSelect}
                checked={selection.isSelectAll}
                indeterminate={selection.isSelectPart}
              />
            )}
            {batchComponents &&
              batchComponents.length > 0 &&
              this.renderBatchComps(selectedRows, batchComponents)}
          </div>
          <div className="tfoot__page">
            {Object.keys(pageInfo).length > 0 && (
              <Pagination
                current={current}
                totalItem={isNil(totalItem) ? total : totalItem}
                pageSize={isNil(pageSize) ? limit : pageSize}
                onChange={onPageChange}
                pageSizeOptions={pageSizeOptions}
              />
            )}
          </div>
        </div>
      )
    );
  }
}
