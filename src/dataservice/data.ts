/*
 * @Author: alownilow alownilow@163.com
 * @Date: 2023-06-27 13:34:01
 * @LastEditors: alownilow alownilow@163.com
 * @LastEditTime: 2023-06-29 12:25:06
 * @FilePath: \alownilow-test\src\dataservice\data.ts
 * @Description: 
 * alownilow@163.com
 * 
 */

/**
 * 字典集合
 */
export interface Dictionary<T> {
    [key: string]: T;
}
/**
 * 类型集合
 */
export interface DataType {
    rid: number;
    name: string;
    nameEn: string;
}
/**
 * 模拟数据
 */
const dataSource: DataType[] = [
    {
        rid: 2595470429880,
        name: '客房(大床)',
        nameEn: 'Queen Room',
    },
    {
        rid: 65656,
        name: '客房(双床Baa)',
        nameEn: 'baa',
    },
    {
        rid: 432423,
        name: '客房(双床CAa)',
        nameEn: 'caa',
    },
    {
        rid: 25955592678231,
        name: '客房(双床AAa)',
        nameEn: 'aaa',
    },
    {
        rid: 2595559267881,
        name: '吃房(双床)aa',
        nameEn: '',
    },
    {
        rid: 2595559267882,
        name: '客房(双床1)',
        nameEn: 'Twin Room',
    },
    {
        rid: 2595559267883,
        name: '哎(双床2双床1)',
        nameEn: '',
    },
    {
        rid: 2595563275880,
        name: '子庭房(7人入住)',
        nameEn: '',
    },
];
/**
 * 
 * @returns 模拟接口请求数据方法
 */
export const pullDataSource = (): Promise<DataType[]> => {

    return new Promise((res, rej) => {
        setTimeout(() => {
            let newdata = dataSource.filter(t => t);
            res(newdata);
        }, 500);
    })

}