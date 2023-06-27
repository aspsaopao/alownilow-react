import React, {
  ForwardedRef,
  forwardRef,
  useImperativeHandle,
  useState,
} from 'react';
import { Button, Input } from 'antd';

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
  pullData?: (v: string) => string;
}

function setvalue<T>(a: keyof T, value: typeof a): T {
  console.log(a, typeof a, value);

  return {
    [a]: value,
  } as T;
};
/**
 * 暴露出去的组件内部结构
 */
export interface AIHeaderRefCurrent {
  myPrivateFunction: () => void;
}
/**
 * forwardRef 是结合 props和ref
 */
const AIHeader = forwardRef(
  (propsData: AIHeaderProps, ref: ForwardedRef<AIHeaderRefCurrent>) => {

    const [cildata, setcildata] = useState<AIHeaderProps>(propsData);

    const data = propsData;

    const submit = () => {
      console.log(123);
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
      console.log('这是内部的方法');
    };
    /**
     *
     */
    const onchange = (v: any) => {
      console.log('onchange触发');
      data.onAlChange(v.target.value);
      if (data.pullData !== undefined) {
        let value = data.pullData(v.target.value);
        // let st = setvalue<AI_HeaderProps>('onAlChange','test');

        let newdata = Object.assign({}, data, setvalue('name', value));
        setcildata(newdata);
      }
    };

    return (
      <div>
        <Button onClick={submit}>{cildata.name}</Button>
        <Input onChange={onchange} />
      </div>
    );
  }
);
export default AIHeader;
