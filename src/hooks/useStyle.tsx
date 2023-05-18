import { useState, useEffect } from 'react';

export function useStyle(prop: any, $ = document.body) {
    const [value, setValue] = useState<any>(getComputedStyle($).getPropertyValue(prop));

    useEffect(() => {
        $.style.setProperty(prop, value);
        // eslint-disable-next-line
    }, [value]);

    return [value, setValue];
}
