import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Radio, Switch, TableColumnsType } from 'antd';
import { Badge, Space, Table } from 'antd';
import styles from './App.less';
import { checkPrime } from 'crypto';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import {
  PlusOutlined,
  MinusOutlined
} from '@ant-design/icons';
import { SwitchChangeEventHandler } from 'antd/es/switch';
/**
 * 字典集合
 */
interface Dictionary<T> {
  [key: number]: T;
}
/**
 * 值类型
 */
interface ValueType {
  /**
   * 0:无法匹配
   * 1:重复标记
   */
  type: number;
  /**
   * 值
   */
  value: number;

}

interface DataType {
  hid: number;
  shid: number;
  name: string;
  platform: string;
  version: string;
  upgradeNum: number;
  creator: string;
  createdAt: string;
  /**
   * 无法匹配  9：打开 5：关闭
   */
  matchStatus: number;
  /**
   * 重复标记 1：打开 0：关闭
   */
  status: number;


  child: DataType[];
}

const App: React.FC = () => {
  const [updateDictionary, setUpdateDictionary] = useState<
    Dictionary<DataType>
  >({});
  const expandedRowRender = (record: DataType) => {
    const columns: TableColumnsType<DataType> = [
      { title: 'Name', dataIndex: 'name', key: 'name', width: 100 },
      { title: 'Platform', dataIndex: 'platform', key: 'platform', width: 100 },
      { title: 'Version', dataIndex: 'version', key: 'version', width: 100 },
      {
        title: 'Upgraded',
        dataIndex: 'upgradeNum',
        key: 'upgradeNum',
        width: 100,
        render: (value: any, record: DataType, index: number) => {
          return <> <Switch
            defaultChecked={record.status == 1}
            checked={lastSwitchValues[record.shid]}
            onChange={(e) => {
              swichChange(record.shid, e, 1);
            }} /><b>重复标记</b></>
        }
      },
      {
        title: 'Creator', dataIndex: 'creator', key: 'creator', width: 100,
        render: (value: any, record: DataType, index: number) => {
          return <><Checkbox onChange={childRadioChang} /><b>匹配</b></>
        }
      },
      { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', width: 100 },
      {
        title: 'Action',
        key: 'operation',
        width: 100,
        render: () => <a>Publish</a>,
      },
    ];
    let data = record.child;
    let newdata = record.child.slice();
    if (!expandDictionary[record.hid]) data = newdata.splice(0, 10);
    //进行数据更新处理，在updateDictionary更新字典中存在就取更新字典的值，否则取原数据的值
    data = data.map((t) => {
      if (!updateDictionary[t.hid]) return t;
      return updateDictionary[t.hid];
    });
    return (
      <Table
        rowKey={'shid'}
        className={styles.expandabletable}
        pagination={false}
        showHeader={false}
        columns={columns}
        dataSource={data}
      />
    );
  };

  const [expandDictionary, setExpandDictionary] = useState<Dictionary<boolean>>(
    {}
  );

  /**
   * table列表项目全局控制折叠的集合ID
   */
  const [allExpandedRowKeys, setAllExpandedRowKeys] = useState<number[]>([]);
  /**
   * table列表项目全局控制check状态
   */
  const [allExpandedRowOpenCheck, setAllExpandedRowOpenCheck] = useState<boolean>(false);
  /**
   * table列表项目全局折叠改变事件
   */
  const allonCheckboxChange = () => {
    if (!allExpandedRowOpenCheck) {
      var expandedRowKeys = data.map(t => t.hid);
      setAllExpandedRowKeys(expandedRowKeys);
    }
    else
      setAllExpandedRowKeys([]);
    setAllExpandedRowOpenCheck(!allExpandedRowOpenCheck);
  }
  /**
   * table列表项的check改变事件
   */
  const onExpand = (value: boolean, dataItem: DataType) => {
    let lastAllExpandedRowKeys = allExpandedRowKeys;
    if (value) {
      lastAllExpandedRowKeys.push(dataItem.hid);
    }
    else {
      lastAllExpandedRowKeys = lastAllExpandedRowKeys.filter(t => t != dataItem.hid);
    }
    setAllExpandedRowKeys(lastAllExpandedRowKeys);
    setAllExpandedRowOpenCheck(data.length <= lastAllExpandedRowKeys.length);

  }


  /**
   * Switch改变数据
   */
  const [switchValues, setSwitchValues] = useState<Dictionary<ValueType>>({});

  /**
 * 原始Switch集合
 */
  const [lastSwitchValues, setLastSwitchValues] = useState<Dictionary<boolean>>(
    {}
  );

  /**
   * switch改变
   * @param id  id
   * @param value 值
   * @param type 0:无法匹配 1:重复标记
   */
  const swichChange = (id: number, value: boolean, type: number = 0) => {
    lastSwitchValues[id] = value;
    setLastSwitchValues(lastSwitchValues);
    let newNotIds = Object.assign({}, switchValues);
    if (newNotIds[id] == undefined) {
      newNotIds[id] = {
        type: type,
        value: !value ? (type == 1 ? 0 : 5) : (type == 1 ? 1 : 9)
      };
    }
    else {
      delete newNotIds[id];
    }
    setSwitchValues(newNotIds); 
  }


  /**
   * 重置
   */
  const reset = () => {

    if (Object.keys(switchValues).length != 0) {
      let newlastSwitchValues: Dictionary<boolean> = Object.assign({}, lastSwitchValues);
      for (const key in lastSwitchValues) {
        if (switchValues[key] != undefined)
          newlastSwitchValues[key] = !lastSwitchValues[key]
      }
      setLastSwitchValues(newlastSwitchValues);
    }
    setSwitchValues({});
  }
  /**
   * 提交
   */
  const submit = () => {
    /**
     * 无法匹配
     */
    let body1 = [];
    /**
     * 重复标记
     */
    let body2 = [];
    for (const key in switchValues) {
      let data = switchValues[key];
      if (data.type == 0) {
        body1.push({
          hid: key,
          status: data.value
        })
      }
      else {
        body2.push({
          shid: key,
          status: data.value
        })
      }
    }
    console.log("无法匹配相关改动", body1, body2);

  }

  const childRadioChang = () => {

  }


  const columns: TableColumnsType<DataType> = [
    {
      title: (record) => {
        return <Button type="link" onClick={allonCheckboxChange} >
          {allExpandedRowOpenCheck ? <MinusOutlined /> : <PlusOutlined />}
        </Button>
      },
      dataIndex: 'allcheck',
      key: '',
      width: 20,
    },
    { title: 'Name', dataIndex: 'name', key: 'name', width: 100, },
    { title: 'Platform', dataIndex: 'platform', key: 'platform', width: 100 },
    { title: 'Version', dataIndex: 'version', key: 'version', width: 100 },
    {
      title: 'Upgraded',
      dataIndex: 'upgradeNum',
      key: 'upgradeNum',
      width: 100,
      render: (value: any, record: DataType, index: number) => {
        return <>
          <Switch
            defaultChecked={record.matchStatus == 9}
            checked={lastSwitchValues[record.hid]}
            onChange={(e) => {
              swichChange(record.hid, e)
            }} /><b>无法匹配</b></>
      }
    },
    {
      title: 'Creator', dataIndex: 'creator', key: 'creator', width: 100,
    },
    { title: 'Date', dataIndex: 'createdAt', key: 'createdAt', width: 100 },
    {
      title: 'Action',
      key: 'operation',
      width: 100,
      render: () => <a>Publish</a>,
    },
  ];

  const data: DataType[] = [];
  for (let i = 0; i < 2; i++) {
    data.push({
      hid: (54535345345 + i),
      shid: (54565 + i),
      name: 'Screen',
      platform: 'iOS',
      version: '10.3.4.5654',
      upgradeNum: 500,
      creator: 'Jack',
      createdAt: '2014-12-24 23:12:00',
      matchStatus: i / 2 == 0 ? 9 : 5,
      status: 0,
      child: [
        {
          child: [],
          hid: (545353453454 + i),
          shid: (i + 10),
          name: 'Screen',
          platform: 'iOS',
          matchStatus: 0,
          status: 1,
          version: '10.3.4.5654',
          upgradeNum: 500,
          creator: 'Jack',
          createdAt: '2014-12-24 23:12:00',
        },
        {
          child: [],
          hid: (5453534534554 + i),
          shid: (i + 11),
          name: 'Screen',
          platform: 'iOS',
          matchStatus: 0,
          status: 0,
          version: '10.3.4.5654',
          upgradeNum: 500,
          creator: 'Jack',
          createdAt: '2014-12-24 23:12:00',
        },
        {
          child: [],
          hid: (5453534598345 + i),
          shid: (i + 12),
          name: 'Screen',
          platform: 'iOS',
          version: '10.3.4.5654',
          matchStatus: 0,
          status: 1,
          upgradeNum: 500,
          creator: 'Jack',
          createdAt: '2014-12-24 23:12:00',
        },
        {
          child: [],
          hid: (54535345353445 + i),
          shid: (i + 13),
          name: 'Screen',
          platform: 'iOS',
          matchStatus: 0,
          status: 0,
          version: '10.3.4.5654',
          upgradeNum: 500,
          creator: 'Jack',
          createdAt: '2014-12-24 23:12:00',
        },
      ],
    });
  }

  return (
    <>
      <Button onClick={submit}>提交-筛选重复的数据</Button>

      <Button onClick={reset}>重置</Button>

      <Table
        columns={columns}
        rowKey={'hid'}
        expandable={{
          expandedRowRender,
          // defaultExpandAllRows: defaultExpandAllRows,  
          expandedRowKeys: allExpandedRowKeys,
          onExpand: onExpand,
          showExpandColumn: true,
          expandedRowClassName: (record, index, indent) => {
            return styles.expandablerow;
          },
          // defaultExpandAllRows: true,
        }}
        dataSource={data}
      />
    </>
  );
};

export default App;
