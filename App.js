import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import axios from 'axios';

export default function App() {
  const [data, setData] = useState([]);
  const [extarData, setExtraData] = useState({});
  const [after, setAfter] = useState('');
  const [before, setBefore] = useState('');
  const [loading, setLoading] = useState(true);
  const [firstRender, setFirsRender] = useState(true);

  const getData = async () => {
    setLoading(true);

    let enndpoint = `https://api.reddit.com/r/dataisbeautiful/new?after=${after}&limit=2&before=${before}`;

    let res = await axios.get(enndpoint);

    if (res.data) {
      setFirsRender(false);
      setLoading(false);
      setBefore('');
      setAfter('');

      setData(
        before
          ? [...res.data.data?.children, ...data]
          : [...data, ...res.data.data?.children],
      );

      setExtraData(res.data);
    }
  };

  useEffect(() => {
    if (after || before || firstRender) {
      getData();
    }
  }, [after, before]);

  const onEndReached = () => {
    !loading && setAfter(extarData?.data.after);
  };

  const onTopReached = event => {
    if (event.nativeEvent.contentOffset.y === 0) {
      if (extarData?.data.before) {
        return true;
      }

      !loading && setBefore(extarData?.data.before);
    }
  };

  return (
    <View
      style={{
        flex: 1,
      }}>
      <Text
        style={{
          color: 'red',
          fontSize: 30,
        }}>
        {data.length}
      </Text>
      {loading && before ? <Text>LOADING</Text> : null}

      <FlatList
        onScroll={r => {
          onTopReached(r);
        }}
        extraData={extarData}
        data={data}
        onEndReached={onEndReached}
        keyExtractor={item => item.data.name}
        renderItem={({item}) => (
          <View
            style={{
              marginBottom: 20,
              borderWidth: 2,
              borderColor: 'gray',
              margin: 10,
              padding: 10,
              height: 450,
            }}>
            <Text>{item.data.subreddit}</Text>
            <Text>{item.data.author_fullname}</Text>
            <Text>{item.data.title}</Text>
            <Text>{item.data.name}</Text>
            <Text>{item.data.created}</Text>
          </View>
        )}
      />

      {loading && after ? <Text>LOADING</Text> : null}
    </View>
  );
}

// anshul@leap.club
