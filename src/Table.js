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

class App extends React.Component {

  state = {
    percentMap: {},
    booleanMap: {},
    numberEnumMap: {},
    numberRangeMap: {},
  }

  onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  }
  onClose = (e) => {
    e.stopPropagation();
    console.log('close...')
  }
  onLeft = (e) => {
    e.stopPropagation();
    console.log('left...')
  }
  onRight = (e) => {
    e.stopPropagation();
    console.log('right...')
  }

  getPercentProps = dataIndex => {
    const handleSearch = (selectedKeys, confirm, clearFilters, dataIndex) => {
      isEqual(selectedKeys, [0, 100]) ? clearFilters() : confirm();
    };

    const handleReset = (clearFilters, dataIndex) => {
      clearFilters();
      this.setState(({ percentMap }) => {
        delete percentMap[dataIndex];
        return { percentMap };
      });
    };

    const handleChange = (setSelectedKeys, value, dataIndex) => {
      setSelectedKeys([value]);
      this.setState(({ percentMap }) => {
        percentMap[dataIndex] = value;
        return { percentMap };
      })
    }
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>  {
        return (
          <div style={{ padding: 8, width: 204 }}>
          <Slider
            range
            value={this.state.percentMap[dataIndex] || [0, 100]}
            tipFormatter={tip => `${tip}%`}
            step={10}
            onChange={value => handleChange(setSelectedKeys, value, dataIndex)}
            onAfterChange={value => handleSearch(value, confirm, clearFilters, dataIndex)}
          />
          <Divider style={{ marginBottom: 6}}/>
          <div onClick={() => handleReset(clearFilters, dataIndex)} style={{ textAlign: 'right', cursor: 'pointer'}}>
          <span>恢复默认</span></div>

          </div>
        );
      },
      onFilter: (value, record) => {
        const num = record[dataIndex] * 100;
        return value[0] <= num && num <= value[1];
      },
      onFilterDropdownVisibleChange: visible => {
      },
      render: text => `${text*100}%`
    }
  }

  getBooleanProps = dataIndex => {
    const handleReset = (clearFilters, dataIndex) => {
      clearFilters();
      this.setState(({ booleanMap }) => {
        delete booleanMap[dataIndex];
        return { booleanMap };
      });
    }

    const handleChange = (setSelectedKeys, value, dataIndex, confirm, clearFilters) => {
      setSelectedKeys([value]);
      isEmpty(value) ? clearFilters() : confirm();
      this.setState(({ booleanMap }) => {
        booleanMap[dataIndex] = value;
        return { booleanMap };
      });
    }

    return {
      render: (value) => (value ?
          <span className="bool-true"><CheckOutlined/></span> : <span className="bool-false"><CloseOutlined/></span>),
      onFilter: (value, record) => value.includes(record[dataIndex]),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>  {
        return (
          <div style={{ padding: 8}}>
          <Checkbox.Group value={this.state.booleanMap[dataIndex]}
            onChange={(value) => handleChange(setSelectedKeys, value, dataIndex, confirm, clearFilters)}>
            <Row><Checkbox value={true}>是</Checkbox></Row>
            <Row><Checkbox value={false}>否</Checkbox></Row>
          </Checkbox.Group>
          <Divider style={{ marginBottom: 6}}/>
          <div onClick={() => handleReset(clearFilters, dataIndex)} style={{ textAlign: 'right', cursor: 'pointer'}}>
          <span>恢复默认</span></div>

          </div>
        );
      },
    }
  }


  getNumberProps = (dataIndex, dataSource) => {
    const handleSearch = (selectedKeys, confirm, clearFilters, dataIndex) => {
      isEqual(selectedKeys, [0, 100]) ? clearFilters() : confirm();
    };

    const handleReset = (clearFilters, dataIndex) => {
      clearFilters();
      this.setState(({ numberEnumMap, numberRangeMap }) => {
        delete numberEnumMap[dataIndex];
        delete numberRangeMap[dataIndex];
        return { numberEnumMap, numberRangeMap };
      });
    }

    const handleEnumChange = (setSelectedKeys, value, dataIndex, confirm, clearFilters) => {
      setSelectedKeys([{value, type: 'enum'}]);
      isEmpty(value) && clearFilters();
      this.setState(({ numberEnumMap, numberRangeMap }) => {
        numberEnumMap[dataIndex] = value;
        delete numberRangeMap[dataIndex];
        return { numberEnumMap, numberRangeMap };
      });
    }

    const handleRangeChange = (setSelectedKeys, value, dataIndex, confirm, clearFilters) => {
      setSelectedKeys([{value, type: 'range'}]);
      isEqual(value, [null, null]) && clearFilters();
      this.setState(({ numberEnumMap, numberRangeMap }) => {
        numberRangeMap[dataIndex] = value;
        delete numberEnumMap[dataIndex];
        return { numberEnumMap, numberRangeMap };
      });
    }
    const count = countBy( dataSource.map(r => r[dataIndex]) );
    const numberRange = this.state.numberRangeMap[dataIndex] || [null, null];
    return {
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) =>  {
        return (
          <div className="table-filter-number">
            <Checkbox.Group value={this.state.numberEnumMap[dataIndex]}
              onChange={(value) => handleEnumChange(setSelectedKeys, value, dataIndex, confirm, clearFilters) }>
              {Object.keys(count).map(c => <div key={c}><Checkbox value={Number(c)}>{`${c} (${count[c]})`}</Checkbox></div>)}
            </Checkbox.Group>
            <div className="custom">
              <div className="custom-title">自定义</div>
              <div className="number-range">
                  <InputNumber className="number-range-input" value={numberRange[0]} min={0}
                    onChange={(value) => handleRangeChange(setSelectedKeys, [value, numberRange[1]], dataIndex, confirm, clearFilters) }/>
                  <span className="number-range-with">~</span>
                  <InputNumber className="number-range-input" value={numberRange[1]} min={0}
                    onChange={(value) => handleRangeChange(setSelectedKeys, [numberRange[0], value], dataIndex, confirm, clearFilters) }/>
              </div>
            </div>
            <Divider style={{ marginBottom: 6}}/>
            <div className="footer">
              <span className="footer-btn confirm" onClick={confirm}>确定</span>
              <span className="footer-btn reset-default" onClick={() => handleReset(clearFilters, dataIndex)}>恢复默认</span>
            </div>
          </div>
        );
      },
      onFilter: (data, record) => {
        const {type, value} = data;
        if (type === 'range') {
          const left = value[0] === null ? - Infinity : value[0], right = value[1] === null ? Infinity : value[1];
          return left <= record[dataIndex] && record[dataIndex] <= right;
        } else if (type === 'enum') {
          return value.includes(record[dataIndex]);
        }
      },
    }
  }
  handleClick = () => {
    console.log('test...')
  }
  render(){  

    const data = [
      {
        key: '1',
        name: 'John Brown',
        age: 22,
        address: 'New York No. 1 Lake Park',
        布尔类型: true,
        percent: 0.34,
      },
      {
        key: '2',
        name: 'Jim Green',
        age: 22,
        address: 'London No. 1 Lake Park',
        布尔类型: true,
        percent: 0.34,

      },
      {
        key: '3',
        name: 'Joe Black',
        age: 32,
        address: 'Sidney No. 1 Lake Park',
        布尔类型: false,
        percent: 0.54,

      },
      {
        key: '4',
        name: 'Jim Red',
        age: 42,
        address: 'London No. 2 Lake Park',
        布尔类型: false,
        percent: 0.8,

      },
    ];
    const [sample] = data;
    const getTitle = (text) => (
      <span className="column">
        <span className="text">{text}</span>
        <span className="btn" onClick={this.onClose}><CloseOutlined/></span>
        <span className="btn" onClick={this.onLeft}><LeftOutlined/> </span>
        <span className="btn" onClick={this.onRight}><RightOutlined/> </span>
      </span>
    )
    const columns = [
      {
      title: 'Full Name',
      width: 200,
      dataIndex: 'name',
      key: 'name',
      fixed: 'left',
      },
      {
        title: getTitle('姓名'),
        dataIndex: 'name',
        filters: [
          {
            text: 'Joe',
            value: 'Joe',
          },
          {
            text: 'Jim',
            value: 'Jim',
          },
          {
            text: 'Submenu',
            value: 'Submenu',
            children: [
              {
                text: 'Green',
                value: 'Green',
              },
              {
                text: 'Black',
                value: 'Black',
              },
            ],
          },
        ],
        // specify the condition of filtering result
        // here is that finding the name started with `value`
        onFilter: (value, record) => record.name.indexOf(value) === 0,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],

      },
      {
        title: getTitle('Age'),
        dataIndex: 'age',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.age - b.age,
        ...this.getNumberProps('age', data),
      },
      {
        title: 'Address',
        dataIndex: 'address',
        filters: [
          {
            text: 'London',
            value: 'London',
          },
          {
            text: 'New York',
            value: 'New York',
          },
        ],
        filterMultiple: false,
        onFilter: (value, record) => record.address.indexOf(value) === 0,
        sorter: (a, b) => a.address.length - b.address.length,
        sortDirections: ['descend', 'ascend'],
      },
      { title : '布尔类型',
        dataIndex: '布尔类型',
        ...this.getBooleanProps('布尔类型'),
      },
      { title : '百分比',
        dataIndex: 'percent',
        ...this.getPercentProps('percent'),
      },
      {
      title: 'Action',
      key: 'operation',
      fixed: 'right',
      width: 200,
      render: () => <a>action</a>,
    },
    ];




    return (
      <div className="App" style={{ paddingTop: 300 }}>
      <Button disabled onClick={this.handleClick}>下一步</Button>
        <Table columns={columns} dataSource={data} scroll={{ x: 1300 }} onChange={this.onChange}
        />
      </div>
    );
  }
}

export default App;
