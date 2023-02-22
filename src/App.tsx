import { useEffect, useRef, useState } from 'react';

type TCustomer = { id: number; items: number };
type TQueue = { [key: string]: TCustomer[] };

function App() {
  const [queue, setQueue] = useState<TQueue>({
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  });

  const inputValue = useRef<HTMLInputElement>(null);

  const pushToQueue = () => {
    if (!inputValue.current?.value || +inputValue.current?.value <= 0) return;

    let newQueue = {
      queueNumber: Object.keys(queue)[0],
      totalAmountOfItems: Object.values(queue)[0].reduce((acc, { id, items }) => {
        acc += items;
        return acc;
      }, 0),
    };

    Object.entries(queue).forEach(([key, value]) => {
      let totalAmountOfItems = value.reduce((acc, { id, items }) => {
        acc += items;
        return acc;
      }, 0);

      if (totalAmountOfItems < newQueue.totalAmountOfItems) {
        newQueue = {
          queueNumber: key,
          totalAmountOfItems,
        };
      }
    });

    setQueue((oldQueue) => {
      const newQueueNumber = newQueue.queueNumber;

      let newCustomer = {
        id: (oldQueue[newQueueNumber][oldQueue[newQueueNumber].length - 1]?.id ?? -1) + 1,
        items: +inputValue.current!.value,
      };

      return {
        ...oldQueue,
        [newQueueNumber]: [...oldQueue[newQueueNumber], newCustomer],
      };
    });
  };

  useEffect(() => {
    let removeUserItem = setInterval(() => {
      setQueue((oldQueue) => {
        return Object.entries(oldQueue).reduce((acc, [key, value]) => {
          if (value[0]?.items === 1) {
            value = value.filter((item, index) => index !== 0);
          } else {
            value = value.map(({ id, items }, index) => {
              if (index === 0)
                return {
                  id,
                  items: items - 1,
                };
              else return { id, items };
            });
          }
          acc[key] = value;
          return acc;
        }, {} as TQueue);
      });
    }, 1000);
    return () => clearInterval(removeUserItem);
  }, [queue]);

  return (
    <div className='min-h-screen pt-20 flex items-center flex-col gap-14 bg-gray-900 text-white font-bold'>
      <h1 className='text-3xl font-bold'>Shopping queue</h1>

      <div className='flex gap-6'>
        <input
          ref={inputValue}
          type='number'
          className='bg-inherit border-2 rounded-xl p-3'
        />
        <button
          className='border-2 rounded-xl p-3 px-6 font-bold hover:scale-105 transition-all'
          onClick={pushToQueue}
        >
          checkout
        </button>
      </div>

      <div className='flex gap-8'>
        {Object.entries(queue).map(([key, value]) => (
          <div
            key={key}
            className='flex flex-col items-center gap-6'
          >
            <h2 className='border-2 rounded-xl px-10 py-6'>Queue nr. {key}</h2>
            {value.map(({ id, items }) => (
              <div
                key={id}
                className='border-2 rounded-full w-24 h-24 flex items-center justify-center'
              >
                {items}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
