import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Button, Input, Tag } from 'antd';

/**
 * 组件常规props
 */
export interface AIHeaderProps {
  /**
   * 声明普通的属性
   */
  name: string;
  /**
   * 声明一个内部的组件事件
   */
  onAlChange: (v: string) => void;
  /**
   * 带返回值的回调事件
   */
  callback?: () => string;
}

/**
 * 暴露出去的组件内部结构
 */
export interface AIHeaderRefCurrent {
  /**
   * 一个内部方法， 返回字符串
   */
  myPrivateFunction: () => string;
}
/**
 * forwardRef 是结合 props和ref
 */
const AIHeader = forwardRef(
  (propsData: AIHeaderProps, ref: ForwardedRef<AIHeaderRefCurrent>) => {

    const [countStr, setCountStr] = useState<string>("");

    const click = () => {
      if (propsData.callback !== undefined) {
        console.log("哇,需要数据,老爹快点给我数据，我马上给你发通知");
        let str = propsData.callback();
        console.log("谢谢老爹的数据，数据很香很好用")
        setCountStr(str);
      }
    };
    /**
     * 注册暴露方法
     */
    useImperativeHandle(ref, () => ({
      myPrivateFunction
    }));

    /**
     * 内部私有方法myPriFunction
     */
    const myPrivateFunction = () => {
      console.log("我居然被老爹使用了，真开心");
      return "老爹记得帮我搽屁股";
    };
    /**
     *
     */
    const onchange = (v: any) => {
      propsData.onAlChange(v.target.value);
    };

    return (
      <div>
        <p>{propsData.name}</p>
        <Button onClick={click}>调用父组件实现的函数</Button>
        <Tag color="magenta">呈现老爹给的数据：{countStr}</Tag>
        <Input onChange={onchange} />
      </div>
    );
  }
);
export default AIHeader;
