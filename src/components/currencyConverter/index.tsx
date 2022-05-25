// import { useAuth, useAuthorizationSettings, useGlobalState, usePublish } from '@shesha/reactjs';
import React, { FC, useEffect, useState } from 'react';
import { Button, Input, message } from 'antd';
import { useGlobalState } from '../../providers';

export interface ICurrencyConverterProps {
    /**
     * The base currency to convert from
     */
    from: string;

    /**
     * The output currency to convert to
     */
    to: string;

    /**
     * The exhange rate
     */
    rate: number;
}

const CurrencyConverter: FC<ICurrencyConverterProps> = ({
    from = 'USD',
    to = 'ZAR',
    rate = 15
}) => {

    const [uAmount, setAmount] = useState(0);
    const [uExchange, setExchange] = useState(0);

    const { setState: setGlobalState } = useGlobalState();

    useEffect(() => {
        onConvert();
    }, [uExchange]);

    const onConvert = () => {
        setExchange(uAmount * rate);
        setGlobalState({ key: "Echange", data: uExchange });
        message.info(uExchange);
        console.log("OnConvert After: amount[%d] exchange[%d] rate[%d]", uAmount, uExchange, rate);
    };

    const onChange = (e) => {
        setAmount(e.target.value);
    };

    return (
        <div>
            <Input style={{ width: '80px' }} onChange={onChange} />
            <Button onClick={onConvert}>Convert {uAmount} {from} to {to}</Button>
        </div>
    );
};

export default CurrencyConverter;