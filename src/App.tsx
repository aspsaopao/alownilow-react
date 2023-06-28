import React, { useEffect, useRef, useState } from 'react';
import { Button, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AIHeader, { AIHeaderProps, AIHeaderRefCurrent } from './component/AlHeader';
import { DataType, pullDataSource, Dictionary } from './dataservice/data';
import  styles from  './App.less';


const App: React.FC = () => {
  /**
   * table数据源
   */
  const [tableData, setTableData] = useState<DataType[]>([]);

  const [lastTableData, setLasttableData] = useState<DataType[]>([]);

  const [alheaderPrivateReturnData, setAlheaderPrivateReturnData] = useState("");

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
        return <p className={matchDataKey[record.rid] ? styles.test : ''}>{record.name}</p>
      }
    },
    {
      title: '英文名称',
      dataIndex: 'nameEn',
    },
  ];
  /**
   * 生命组件AIHeader的ref 
   * 并在下面组件使用： <AIHeader  ref={aIHeaderref} />
   */
  const aIHeaderref = useRef<AIHeaderRefCurrent>(null);

  /**
   * al组件值改变事件
   * @param e 值
   */
  const onAlChange = (e: string) => {
    let newmatchDataKey: Dictionary<DataType> = {};
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
  /**
   * AIHeaderProps组件 callback
   * @returns 
   */
  const onAIHeaderPropsCallBack = () => {
    
    //这里进行业务处理
    console.log("儿子给我发信息了 我看看，居然要数据 还是string类型，随便给一个吧");
    return '儿子记得吃--狗屎';
  };
  /**
   * 组件参数
   */
  const poopdata: AIHeaderProps = {
    name: '一个普通的参数，狗儿子',
    onAlChange: onAlChange,
    callback: onAIHeaderPropsCallBack,
  };

  const click = () => {
    console.log("准备调用子组件方法，看他想做啥")
    let str = aIHeaderref.current?.myPrivateFunction()??"";
    setAlheaderPrivateReturnData(str);
    console.log("子组件方法调用结束，得到子组件方法返回的信息，并展示了")
  }
  return (
    <div>
      <AIHeader   {...poopdata} ref={aIHeaderref} />
      <Button onClick={click}>试试儿子'AIHeader组件'中的方法</Button>
      <Tag color="lime">{alheaderPrivateReturnData}</Tag>
      <p  className={styles.test}>dasd</p>
      <Table
        key="table"
        rowKey={'rid'}
        columns={columns}
        dataSource={tableData}
      />
    </div>
  );
};

export default App;
