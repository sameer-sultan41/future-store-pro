const localStorageName = "cartStore";

export const loadState = () => {
  const tempState = {
    cart: {
      items: [],
      isVisible: false,
    },
    wishlist: {
      items: [],
    },
  };
  try {
    const serializedState = localStorage.getItem(localStorageName);
    if (!serializedState) return tempState;
    const parsedState = JSON.parse(serializedState);
    tempState.cart.items = parsedState.cart?.items || [];
    tempState.wishlist.items = parsedState.wishlist?.items || [];
    return tempState;
  } catch {
    return tempState;
  }
};
//eslint-disable-next-line
export const saveState = (state: any) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(localStorageName, serializedState);
  } catch {
    console.error("Failed to save state");
  }
};
