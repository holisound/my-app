import React, {useState,} from 'react';
import { Tree, Button, Select, Checkbox } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
// 由于 antd 组件的默认文案是英文，所以需要修改为中文
import 'moment/locale/zh-cn';
import 'antd/dist/antd.css';
import './App.scss';
import reqwest from 'reqwest';
import filter from 'lodash/filter';
import PropTypes from 'prop-types';
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
        motion={null}
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



const GroupSelect = ({ options }) => {
  const [gsValue, setGsValue] = useState([]);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(false);
  const [visible, setVisible] = useState(false);
  const [search, setSearch] = useState('');
  const okDisabled = !gsValue.length;
  const resetDisabled = !gsValue.length && !search;
  const flatten = options => {
    const res = [];
    for (let g of options) {
      for (let opt of g.options) {
        res.push(opt);
      }
    }
    return res;
  };
  const flattenOptions = search ? filter(flatten(options), opt => opt.includes(search)) : flatten(options);
  return (
    <div className="group-select">
      <Select 
        placeholder="选择群组"
        suffixIcon={<SearchOutlined/>}
        clearIcon={<SearchOutlined/>}
        onDropdownVisibleChange={visible => setVisible(visible)}
        showSearch mode="multiple" open={visible} value={gsValue} maxTagCount={3} style={{ width: 220 }} 
        onDeselect={value => {
          value = filter(gsValue, v => v !== value);
          setGsValue(value);
          setIndeterminate(!!value.length && value.length < flattenOptions.length);
          setCheckAll(false);
        }}
        onSearch={value => setSearch(value)}
        dropdownRender={() => {
          return (
            <div className="group-select-dropdown">
              <div className="dropdown-content">
                { !! flattenOptions.length && <div className="select-item"><Checkbox checked={checkAll} indeterminate={indeterminate}
                  onChange={e => {
                    const { checked } = e.target;
                    setCheckAll(checked);
                    setIndeterminate(false);
                    setGsValue(checked ? flattenOptions : []);
                  }}>选择全部</Checkbox></div>}
                { !flattenOptions.length ? <div className="no-data">没有数据</div> : <Checkbox.Group value={gsValue} onChange={value => {
                  setGsValue(value);
                  setCheckAll(value.length == flattenOptions.length);
                  setIndeterminate(!!value.length && value.length < flattenOptions.length);
                }}>
                  {options.map( grp => {
                    const options = search ? filter(grp.options, opt => opt.includes(search)) : grp.options;
                    return !!options.length && <div className="select-item-group" key={grp.label}>
                      <div className="item-group-title">{grp.label}</div>
                      {options.map(opt => <div key={opt} className="select-item"><Checkbox value={opt}>{opt}</Checkbox></div>)}
                    </div>;
                  }          
                  )}
                </Checkbox.Group>}
              </div>
              <div className="dropdown-footer">
                <span className={`footer-btn reset ${resetDisabled ? 'disabled' : ''}`} onClick={() => {
                  if (resetDisabled) return;
                  setGsValue([]);
                  setCheckAll(false);
                  setIndeterminate(false);
                  setSearch('');
                }}>恢复默认</span>
                <span className={`footer-btn ok ${okDisabled ? 'disabled': ''}`} 
                  onClick={() => setVisible(false)}>确定</span>
              </div>
            </div> 
          );
        }}>
      </Select>  
    </div>
  );
};
GroupSelect.propTypes = {
  options: PropTypes.array,
};

class App extends React.Component {
  constructor(props) {
    super(props);
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

    const items = [...(new Array(2))].map(i => <div key={i} className="flex-item"></div>);
    const num = items.length;
    const width = (num > 0 ? 100 : 0) + Math.max(0, 96 * (num-1));
    const waitms = 300;
    const options = [
      { label: '组织1', options: ['群众1','a', 'aaa', '群众2','群众3']},
      { label: '组织2', options: ['群众4','群众5','群众6']},
    ];


      // <Button 
      //  onMouseLeave={() => {
      //   this.timeout = setTimeout(() => {
      //     this.setState({ show: false })
      //   }, waitms)
      // }}
      //  onMouseEnter={() => {
      //   this.timeout && clearTimeout(this.timeout);
      //   this.setState({ show: true })
      // }}>loading more</Button>
      // <div 
      //  onMouseLeave={() => {
      //   this.timeout = setTimeout(() => {
      //     this.setState({ show: false })
      //   }, waitms)
      // }}
      // onMouseEnter={() => {this.timeout && clearTimeout(this.timeout)}}
      // className={`show-me ${this.state.show ? 'show' : ''}`}></div>
    return (
      <div style={{ margin: '0 auto', width: 400}}>

      <div className="flex-container" style={{ width}}>
        <GroupSelect options={options}/>

      </div>
      <div>



      </div>
      </div>
    );
  }
}

      {/*<Tree2/>*/}
export default App;
