import React, { useEffect, useRef, useState } from 'react';
import { Button, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { TableRowSelection } from 'antd/es/table/interface';
import AIHeader, { AIHeaderProps, AIHeaderRefCurrent } from './component/AlHeader';
import './App.css'
/**
 * 字典集合
 */
interface Dictionary<T> {
  [key: string]: T;
}
interface DataType {
  rid: number;
  name: string;
  nameEn: string;
}

const dataSource: DataType[] = [
  {
    rid: 2595470429880,
    name: '客房(大床)',
    nameEn: 'Queen Room',
  },
  {
    rid: 65656,
    name: '客房(双床aaa)',
    nameEn: 'Twin Room',
  },
  {
    rid: 25955592678231,
    name: '客房(双床AAa)',
    nameEn: 'Twin Room',
  },
  {
    rid: 2595559267881,
    name: '客房(双床)',
    nameEn: 'Twin Room',
  },
  {
    rid: 2595559267882,
    name: '客房(双床1)',
    nameEn: 'Twin Room',
  },
  {
    rid: 2595559267883,
    name: '客房(双床2双床1)',
    nameEn: 'Twin Room',
  },
  {
    rid: 2595563275880,
    name: '家庭房(7人入住)',
    nameEn: 'Family Room for 7 People',
  },
];

const pullDataSource = (): Promise<DataType[]> => {

  return new Promise((res, rej) => {
    setTimeout(() => {
      let newdata = dataSource.filter(t => t);
      res(newdata);
    }, 500);
  })

}

const App: React.FC = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<number[]>([]);
  /**
   * table数据源
   */
  const [tableData, setTableData] = useState<DataType[]>([]);

  const [lastTableData, setLasttableData] = useState<DataType[]>([]);


  useEffect(() => {
    (async () => {
      let res = await pullDataSource();
      setLasttableData(res.filter(t => t));
      setTableData(res);
    })();
  }, [])
  /**
   * 匹配数据源缓存key
   */
  const [matchDataKey, setMatchDataKey] = useState<Dictionary<DataType>>({});

  const columns: ColumnsType<DataType> = [
    {
      title: '名称',
      dataIndex: 'name',
      render: (value: any, record: DataType, index: number) => {
        return <p className={matchDataKey[record.rid] ? 'test' : ''}>{record.name}</p>
      }
    },
    {
      title: '英文名称',
      dataIndex: 'nameEn',
    },
  ];

  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys: selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      console.log('selectedRowKeys changed: ', newSelectedRowKeys);
      setSelectedRowKeys(newSelectedRowKeys as number[]);
    },
  };
  const submit = async () => {
    let res = await pullDataSource();
    setTableData(res);
    // console.log(ref11, 4544);
    // if (ref11) {
    //   ref11.current.myPriFunction();
    // }
    // //接口测试
    // setSelectedRowKeys([]);
  };

  let aIHeaderref = useRef<AIHeaderRefCurrent>(null);

  /**
   * al组件值改变事件
   * @param e 值
   */
  const onAlChange = (e: string) => {
    let newmatchDataKey: Dictionary<DataType> = {};
    aIHeaderref.current?.myPrivateFunction();
    if (e === "") {
      setMatchDataKey(newmatchDataKey);
      setTableData(lastTableData);
      return;
    }
    let newdata: DataType[] = [];
    lastTableData.forEach((item) => {
      var regex = new RegExp(e, "i");
      if (regex.test(item.name)) {
        let id = item.rid.toString();
        newmatchDataKey[id] = item;
        newdata.unshift(item);
      } else {
        newdata.push(item);
      }
    });

    setMatchDataKey(newmatchDataKey);
    setTableData(newdata);
  };
  const pullData = (e: string) => {
    // console.log(2323);
    return '得到回调的数据进行返回' + e;
  };

  const poopdata: AIHeaderProps = {
    name: '实现了回调',
    onAlChange: onAlChange,
    pullData: pullData,
  };

  return (
    <div>
      <Button onClick={submit}>拉取数据</Button>
      <AIHeader   {...poopdata} ref={aIHeaderref} />
      <Table
        key="table"
        rowKey={'rid'}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={tableData}
      />
    </div>
  );
};

export default App;
