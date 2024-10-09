export const throttledFetch = async (func: () => any, delay = 300, lastCalledTime: number, setLastCalledTime: React.Dispatch<number>) => {
    const now = Date.now();

    if (now - lastCalledTime >= delay) {
        setLastCalledTime(now);
        await func();
    }
};


export const debounce = <F extends (...args: any[]) => any>(
    func: F,
    delay: number,
    timeoutId: NodeJS.Timeout | undefined,
    setTimeoutId: React.Dispatch<NodeJS.Timeout>,
): ((...args: Parameters<F>) => void) => {
    return (...args: Parameters<F>) => {
        clearTimeout(timeoutId);
        setTimeoutId(setTimeout(() => func(...args), delay));
    };
};

