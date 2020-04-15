import React from 'react';
import ReactDOM from 'react-dom';
import { Layout, Row, Col, Table, ConfigProvider, DatePicker, Card, Spin,
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
      </div>
    );
  }
}

export default App;
