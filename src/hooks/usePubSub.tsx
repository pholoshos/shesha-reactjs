// import React from 'react';

import { useEffect } from 'react';
import { IPubSubPayload } from '../interfaces/pubsub';

interface ISubscription<T> {
  /**
   *
   */
  subscribe?: (token: string, eventHandler: (data: T) => void) => void;

  /**
   * A function for unsubscribing to events to events
   */

  unsubscribe?: (token: string) => void;

  /**
   * A function for publishing events
   * @param token -
   * @param data
   */
  publish(token: string, data?: T): void;

  /**
   * Clears all event listeners for this instance
   */
  clearAllEventListeners(): void;
}

/**
 * A hook that can be used to deal with custom events in react applications that works similar to pub sub pattern
 *
 * @returns {object} instance of subscription
 */
export const usePubSub = <T,>(): ISubscription<T> => {
  const subscribe = (token: string, eventHandler: (data: T) => void) => {
    const handleEvent = (event: CustomEvent | Event) => {
      const data = (event as CustomEvent).detail;
      eventHandler(data);
    };

    addEventListener(token, handleEvent, false);
  };

  const unsubscribe = (token: string) => removeEventListener(token, () => {}, false);

  const publish = (token: string, data?: T) => dispatchEvent(new CustomEvent(token, { detail: data }));

  const clearAllEventListeners = () => {
    // events.forEach(localEvent => {
    //   removeEventListener(localEvent, () => {}, false);
    // });
    // setEvents([]);
  };

  return { subscribe, unsubscribe, publish, clearAllEventListeners };
};

export function useSubscribe(eventName: string, eventHandler: (data: IPubSubPayload) => void): void {
  useEffect(() => {
    const handleEvent = (event: CustomEvent | Event) => {
      const data = (event as CustomEvent).detail;
      eventHandler(data);
    };

    addEventListener(eventName, handleEvent, false);

    return () => {
      removeEventListener(eventName, handleEvent, false);
    };
  });
}
