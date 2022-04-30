import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";

export function AutoHideActivityIndicator({
  maxAge = 0.3,
}: {
  maxAge?: number;
}) {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    let timer = null;
    timer = setTimeout(() => {
      setHide(true);
    }, maxAge * 1000);
    return () => {
      clearTimeout(timer);
    };
  }, [maxAge]);

  if (hide) {
    return null;
  }
  return <ActivityIndicator />;
}
