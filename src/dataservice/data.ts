
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