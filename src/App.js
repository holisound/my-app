import React from 'react';
import ReactDOM from 'react-dom';
import { Row, Table, ConfigProvider, DatePicker, message, Select, Button, Tooltip, Slider, Divider, InputNumber, Checkbox } from 'antd';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import { CheckOutlined, CloseOutlined, RightOutlined, LeftOutlined, SearchOutlined } from '@ant-design/icons';
import zhCN from 'antd/es/locale/zh_CN';
import moment from 'moment';
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import './App.scss';
import isBoolean from 'lodash/isBoolean';
import isEqual from 'lodash/isEqual';
import isEmpty from 'lodash/isEmpty';
import countBy from 'lodash/countBy';
import uniq from 'lodash/uniq';
import filter from 'lodash/filter';
import difference from 'lodash/difference';
import { Transfer, Tree } from 'antd';
import { countDash } from './util/tree';

const { TreeNode } = Tree;

// Customize Table Transfer
const isChecked = (selectedKeys, eventKey) => {
  return selectedKeys.indexOf(eventKey) !== -1;
};

function flatten(list = [], result=[]) {
  list.forEach(item => {
    result.push(item);
    flatten(item.children, result);
  });
  return result
}


const renderItem = item => {
  const customLabel = (
    <span className="custom-item">
      {item.key}
      <div>牛逼....</div>
    </span>
  );

  return {
    label: customLabel, // for displayed item
    value: item.title, // for title and filter matching
  };
};




const dataSource = [
  { key: '0-0', title: '0-0' },
  {
    key: '0-1',
    title: '0-1',
    children: [
    { key: '0-1-0', title: '0-1-0', children: [{key: '0-1-0-0', title: '0-1-0-0'},{key: '0-1-0-1', title: '0-1-0-1'},] }, 
    { key: '0-1-1', title: '0-1-1' },
    { key: '0-1-2', title: '0-1-2' },
    { key: '0-1-3', title: '0-1-3' },
    { key: '0-1-4', title: '0-1-4' },
    { key: '0-1-5', title: '0-1-5' },
    { key: '0-1-6', title: '0-1-6' },
    { key: '0-1-7', title: '0-1-7' },
    { key: '0-1-8', title: '0-1-8' },
    { key: '0-1-9', title: '0-1-9' },
    { key: '0-1-10', title: '0-1-10' },
    { key: '0-1-11', title: '0-1-11' },
    { key: '0-1-12', title: '0-1-12' },
    { key: '0-1-13', title: '0-1-13' },
    { key: '0-1-14', title: '0-1-14' },
    { key: '0-1-15', title: '0-1-15' },
    { key: '0-1-16', title: '0-1-16' },
    { key: '0-1-17', title: '0-1-17' },
    { key: '0-1-18', title: '0-1-18' },
    { key: '0-1-19', title: '0-1-19' },
    { key: '0-1-20', title: '0-1-20' },
    { key: '0-1-21', title: '0-1-21' },
    { key: '0-1-22', title: '0-1-22' },
    { key: '0-1-23', title: '0-1-23' },
    ],
  },
  { key: '0-2', title: '0-3' },
];

class App extends React.Component {
  state = {
    targetKeys: [],
    selectedKeys: [],
    rightAllChecked: false,
    limit: 20,
  };

  generateTree = (treeNodes = [], targetKeys = [], selectedKeys = []) => {
    const { limit } = this.state;
    const total = targetKeys.length + selectedKeys.length;
    return treeNodes.map(({ children, ...props }) => {
      return (
        <TreeNode {...props}
          disabled={targetKeys.includes(props.key) || !selectedKeys.includes(props.key) && total >= limit }
          key={props.key}>
          {this.generateTree(children, targetKeys, selectedKeys)}
        </TreeNode>
      )
    });
  };

  handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
    this.setState({
      selectedKeys: sourceSelectedKeys.concat(targetSelectedKeys)
    })
  }

  handleRightCheckAll = (e) => {
    this.setState(({ selectedKeys, targetKeys }) => {
      const { checked } = e.target;
      return {
        rightAllChecked: checked,
        selectedKeys: checked ? 
          uniq(selectedKeys.concat(targetKeys))
          : difference(selectedKeys, targetKeys)
      };
    })
  }
  onChange = (targetKeys, direction, moveKeys) => {
    const map = {};
    flatten(dataSource).forEach( d => {
      map[d.key] = isEmpty(d.children);
    })
    this.setState({
      targetKeys: filter(targetKeys, k => map[k]), 
      rightAllChecked: false 
    });
  };

  render() {
    const { targetKeys, selectedKeys, rightAllChecked, leftAllChecked, limit } = this.state;


    function isChild(rootKey, key) {
      return key.startsWith(rootKey) && countDash(key) > countDash(rootKey);
    }

    function getChildren(rootKey, dataSource, leafLimit) {
      // 子节点中最多包含（20 - checkedKeys.length）个叶节点
      let res = [], countLeaf = 0;
      for (let node of dataSource) {
        if (countLeaf >= leafLimit) break;
        const { key } = node;
        if (isChild(rootKey, key)){
          res.push(node)
          if (isEmpty(node.children)) {
            countLeaf ++
          }
        }
      }
      return res;
    }
    const transferDataSource = flatten(dataSource);

    return (
      <div style={{ width: 800, margin: '20px auto'}}>
        <Transfer
          selectAllLabels={[
            null,
            <span>
              <Checkbox 
                checked={rightAllChecked} 
                disabled={isEmpty(targetKeys)} 
                onChange={this.handleRightCheckAll}
              >right</Checkbox>
            </span>
          ]}
          onChange={this.onChange}
          render={renderItem}
          targetKeys={targetKeys}
          selectedKeys={selectedKeys}
          dataSource={transferDataSource}
          className="tree-transfer"
          showSelectAll={false}
          onSelectChange={this.handleSelectChange}
        >
          {({ direction, onItemSelect, onItemSelectAll, selectedKeys }) => {
            if (direction === 'left') {
              const checkedKeys = [...selectedKeys, ...targetKeys];
              return (
                <Tree
                  blockNode={false}
                  checkable
                  checkStrictly
                  defaultExpandAll
                  checkedKeys={checkedKeys}
                  onCheck={(
                    _,
                    {
                      node: {
                        props: { eventKey },
                      },
                    },
                  ) => {
                    const checked = isChecked(checkedKeys, eventKey);
                    const checkedChildKeys = filter(checkedKeys, key => isChild(eventKey, key));
                    let items = [eventKey];
                    if (checked) {
                      items = items.concat(checkedChildKeys)
                    } else {
                      const children = getChildren(eventKey, transferDataSource, limit - checkedKeys.length + checkedChildKeys.length);
                      items = items.concat(
                        filter(
                          children.map(x => x.key), k => !targetKeys.includes(k)
                        )
                      );
                    }
                    onItemSelectAll(items, !checked)
                  }}
                  onSelect={(
                    _,
                    {
                      selected,
                      node: {
                        props: { eventKey },
                      },
                    },
                  ) => {
                    const checked = isChecked(checkedKeys, eventKey);
                    const checkedChildKeys = filter(checkedKeys, key => isChild(eventKey, key));
                    let items = [eventKey];
                    if (checked) {
                      items = items.concat(checkedChildKeys)
                    } else {
                      const children = getChildren(eventKey, transferDataSource, limit - checkedKeys.length + checkedChildKeys.length);
                      items = items.concat(
                        filter(
                          children.map(x => x.key), k => !targetKeys.includes(k)
                        )
                      );
                    }
                    onItemSelectAll(items, !checked)
                  }}
                >
                  {this.generateTree(dataSource, targetKeys, selectedKeys)}
                </Tree>
              );
            }
          }}
        </Transfer>
    </div>
    );
  }
}

export default App;


