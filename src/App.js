import React, {useState} from 'react';
import ReactDOM from 'react-dom';
import { Layout, Row, Col, Table, ConfigProvider, DatePicker, Card, Spin, Tree,
  message, Select, Button, Tooltip, Slider, Divider, InputNumber, Checkbox } from 'antd';
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
import every from 'lodash/every';


import { List, Avatar, Skeleton } from 'antd';

import reqwest from 'reqwest';

const count = 3;
const fakeDataUrl = `https://randomuser.me/api/?results=${count}&inc=name,gender,email,nat&noinfo`;

const treeData = [
  {
    title: '0-0',
    key: '0-0',
    children: [
      {
        title: '0-0-0',
        key: '0-0-0',
        children: [
          {
            title: '0-0-0-0',
            key: '0-0-0-0',
          },
          {
            title: '0-0-0-1',
            key: '0-0-0-1',
          },
          {
            title: '0-0-0-2',
            key: '0-0-0-2',
          },
        ],
      },
      {
        title: '0-0-1',
        key: '0-0-1',
        children: [
          {
            title: '0-0-1-0',
            key: '0-0-1-0',
          },
          {
            title: '0-0-1-1',
            key: '0-0-1-1',
          },
          {
            title: '0-0-1-2',
            key: '0-0-1-2',
          },
        ],
      },
      {
        title: '0-0-2',
        key: '0-0-2',
      },
    ],
  },
  {
    title: '0-1',
    key: '0-1',
    children: [
      {
        title: '0-1-0-0',
        key: '0-1-0-0',
      },
      {
        title: '0-1-0-1',
        key: '0-1-0-1',
      },
      {
        title: '0-1-0-2',
        key: '0-1-0-2',
      },
    ],
  },
  {
    title: '0-2',
    key: '0-2',
  },
];
const Tree2 = () => {    
  const [expandedKeys, setExpandedKeys] = useState(['0-0-0', '0-0-1']);
  const [checkedKeys, setCheckedKeys] = useState(['0-0-0']);
  const [selectedKeys, setSelectedKeys] = useState([]);
  const [autoExpandParent, setAutoExpandParent] = useState(true);

  const onExpand = expandedKeys => {
    console.log('onExpand', expandedKeys); // if not set autoExpandParent to false, if children expanded, parent can not collapse.
    // or, you can remove all expanded children keys.

    setExpandedKeys(expandedKeys);
    setAutoExpandParent(false);
  };

  const onCheck = checkedKeys => {
    console.log('onCheck', checkedKeys);
    setCheckedKeys(checkedKeys);
  };

  const onSelect = (selectedKeys, info) => {
    console.log('onSelect', info);
    setSelectedKeys(selectedKeys);
  };
  return (
    <Tree
        checkable
        onExpand={onExpand}
        expandedKeys={expandedKeys}
        autoExpandParent={autoExpandParent}
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        onSelect={onSelect}
        selectedKeys={selectedKeys}
        treeData={treeData}
      />
  )
}

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      initLoading: true,
      loading: false,
      data: [],
      list: [],
      show: false,
    };
    this.tooltips = [];
  }

  componentDidMount() {
    this.getData(res => {
      this.setState({
        initLoading: false,
        data: res.results,
        list: res.results,
      });
    });
  }

  getData = callback => {
    reqwest({
      url: fakeDataUrl,
      type: 'json',
      method: 'get',
      contentType: 'application/json',
      success: res => {
        callback(res);
      },
    });
  };

  onLoadMore = () => {
    this.setState({
      loading: true,
      list: this.state.data.concat([...new Array(count)].map(() => ({ loading: true, name: {} }))),
    });
    this.getData(res => {
      const data = this.state.data.concat(res.results);
      this.setState(
        {
          data,
          list: data,
          loading: false,
        },
        () => {
          // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
          // In real scene, you can using public method of react-virtualized:
          // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
          window.dispatchEvent(new Event('resize'));
        },
      );
    });
  };
  handleClick = (e) => {
    console.log(e.target)
  }
  render() {
    const { initLoading, loading, list } = this.state;

    const items = [...(new Array(2))].map(i => <div key={i} className="flex-item"></div>);
    const num = items.length;
    const width = (num > 0 ? 100 : 0) + Math.max(0, 96 * (num-1));
    const waitms = 300;
    const { TreeNode } = Tree;


    return (
      <div style={{ margin: '0 auto', width: 400}}>
      <Button 
       onMouseLeave={() => {
        this.timeout = setTimeout(() => {
          this.setState({ show: false })
        }, waitms)
      }}
       onMouseEnter={() => {
        this.timeout && clearTimeout(this.timeout);
        this.setState({ show: true })
      }}>loading more</Button>
      <div 
       onMouseLeave={() => {
        this.timeout = setTimeout(() => {
          this.setState({ show: false })
        }, waitms)
      }}
      onMouseEnter={() => {this.timeout && clearTimeout(this.timeout)}}
      className={`show-me ${this.state.show ? 'show' : ''}`}></div>

      <div className="flex-container" style={{ width }}>
        {items}
      </div>
      <div>
      <Tree2/>

      </div>
      </div>
    );
  }
}

export default App;
