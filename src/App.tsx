import React, { useEffect, useRef, useState } from 'react';
import { Button, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import AIHeader, { AIHeaderProps, AIHeaderRefCurrent } from './component/AlHeader';
import { DataType, pullDataSource, Dictionary } from './dataservice/data';
import styles from './App.less';


const App: React.FC = () => {
  /**
   * table数据源
   */
  const [tableData, setTableData] = useState<DataType[]>([]);

  const [lastTableData, setLasttableData] = useState<DataType[]>([]);

  const [alheaderPrivateReturnData, setAlheaderPrivateReturnData] = useState("");

  useEffect(() => {
    (async () => {

      //模拟你接口取得数据 你自己替换
      let roomTypeList = await pullDataSource();
      //这里就是进行排序 然后更新usestate
      let endata: DataType[] = roomTypeList.filter(t => t.nameEn != "");
      let notEndata: DataType[] = roomTypeList.filter(t => t.nameEn == "");
      sortTableData(endata, notEndata, setTableData);


      setLasttableData(roomTypeList.filter(t => t));
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
        return <> <p className={matchDataKey[record.rid] ? styles.test : ''}>{record.name}</p>
          <p className={matchDataKey[record.rid] ? styles.test : ''}>{record.nameEn}</p>

        </>
      }
    },
    {
      title: '英文名称',
      dataIndex: 'nameEn',
      render: (value: any, record: DataType, index: number) => {
        return <p className={matchDataKey[record.rid] ? styles.test : ''}>{record.nameEn}</p>
      }
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

    let refexdata = getRegexData(lastTableData, e, newmatchDataKey);
    sortTableData(refexdata[0], refexdata[1], setTableData);

    setMatchDataKey(newmatchDataKey);
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
    let str = aIHeaderref.current?.myPrivateFunction() ?? "";
    setAlheaderPrivateReturnData(str);
    console.log("子组件方法调用结束，得到子组件方法返回的信息，并展示了")
  }
  return (
    <div>
      <AIHeader   {...poopdata} ref={aIHeaderref} />
      <Button onClick={click}>试试儿子'AIHeader组件'中的方法</Button>
      <Tag color="lime">{alheaderPrivateReturnData}</Tag>
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

/**
 * 获取匹配数据数组
 * @param lastTableData 原来数据
 * @param regExpstr 匹配字符串
 * @param newmatchDataKey 匹配数据源缓存key的useState
 * @returns  [匹配成功,匹配失败]
 */
function getRegexData(lastTableData: DataType[], regExpstr: string, newmatchDataKey: Dictionary<DataType>): [DataType[], DataType[]] {

  let regexdata: DataType[] = [];
  let notRegexdata: DataType[] = [];
  lastTableData.forEach((item) => {
    var regex = new RegExp(regExpstr, "i");
    if (regex.test(item.name + item.nameEn)) {
      let id = item.rid.toString();
      newmatchDataKey[id] = item;
      regexdata.push(item);
    } else {
      notRegexdata.push(item);
    }
  });
  return [regexdata, notRegexdata];
}

/**
 * 排序tableData数据源  
 * @param endata 含有英文的数据数组 | 模糊匹配到的数组
 * @param notEndata  不含有英文的数据数组 | 没有模糊匹配到的数组
 * @param setTableData  table的useState
 */
function sortTableData(endata: DataType[], notEndata: DataType[], setTableData: React.Dispatch<React.SetStateAction<DataType[]>>) {

  let newregexnotEnddata = endata.filter(t => t.nameEn == "");
  let newregexenddata = endata.filter(t => t.nameEn != "");

  newregexnotEnddata.sort((item1, item2) => {
    return item1.name.localeCompare(item2.name);
  });
  newregexenddata.sort((item1, item2) => {
    if (item1.nameEn.toUpperCase() < item2.nameEn.toUpperCase())
      return -1;
    return 1;
  });

  let newnotEnddata = notEndata.filter(t => t.nameEn == "");
  let newenddata = notEndata.filter(t => t.nameEn != "");
  newnotEnddata.sort((item1, item2) => {
    return item1.name.localeCompare(item2.name);
  });
  newenddata.sort((item1, item2) => {
    if (item1.nameEn.toUpperCase() < item2.nameEn.toUpperCase())
      return -1;
    return 1;
  });

  setTableData([...newregexenddata, ...newregexnotEnddata, ...newenddata, ...newnotEnddata]);
}

