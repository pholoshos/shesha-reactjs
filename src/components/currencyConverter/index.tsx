import React, { FC } from 'react';
import { Input } from 'antd';

export interface ICurrencyConverterProps {
    /**
     * The base value of the currency to convert from
     */
    inputValue: number;

    /**
     * The base currency to convert from
     */
    inputCurrency: string;

    /**
     * The output currency to convert to
     */
    outputCurrency: string;

    /**
     * The currency conversion rate
     */
    conversionRate: number;
}

const CurrencyConverter: FC<ICurrencyConverterProps> = ({
    inputValue,
    inputCurrency = 'USD',
    outputCurrency = 'ZAR',
    // conversionRate
}) => {
    return (
        <>
            <Input.Group>
                <Input addonAfter={inputCurrency} defaultValue={inputValue} />
                <Input addonAfter={outputCurrency} />
            </Input.Group>
        </>
    );
};

export default CurrencyConverter;