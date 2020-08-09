import React, { useState, useEffect } from "react";
import { Panel, Spinner, Div } from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import firebase from "firebase/app";
import { getDistance } from "geolib";

import { YMaps, Map, Placemark, Circle } from 'react-yandex-maps';

import EventCardList from "../Event/EventCardList";
import Filter from "../../utils/Filter";

const LocationEvents = (props) => {

  // Fetch data
  const database = firebase.database();
  const [loading, setLoading] = useState(true);

  const [fetchedEvents, setEvents] = useState([]);
  const [location, setLocation] = useState([56.85, 60.6]);
  const [filter, setFilter] = useState(new Filter(0, null));

  useEffect(() => {
    bridge.subscribe(({ detail: { type, data } }) => {
      if (type === "VKWebAppUpdateConfig") {
        const schemeAttribute = document.createAttribute("scheme");
        schemeAttribute.value = data.scheme ? data.scheme : "client_light";
        document.body.attributes.setNamedItem(schemeAttribute);
      }
    });
    async function fetchData() {
      const location = await bridge.send("VKWebAppGetGeodata");
      setLocation([location.lat, location.long]);
    }
    fetchData();
  }, []);


  useEffect(() => {
    function fetchEvents() {
      // Events data
      database.ref("events").on("value", dataSnapshot => {
        const events = Object.entries(dataSnapshot.val()).map(e => {
          return { id: e[0], ...e[1] };
        });
        setEvents(events);
        setLoading(false);
      });
    }
    fetchEvents();
  }, [database]);

  // Fetched here
  const filteredEvents = fetchedEvents.filter(event => {
    if (filter['location']) {
      // TODO : fix incorrect distance calculation.
      const distanceFromMe = getDistance(
        { latitude: event.location.lat, longitude: event.location.lng },
        { latitude: location[1], longitude: location[0] }
      );
      if (distanceFromMe <= filter.location)
        return true;
    }
    return false;
  });

  // Display loading animation
  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Spinner size="large" style={{ marginTop: 20 }} />
      </div>
    );

  return (
    <Panel>
      <Div style={{ height: "240px", padding: 0 }}>
        <YMaps >
          <Map defaultState={{ center: location, zoom: 10 }} width={'100%'}>
            <Placemark geometry={location} options={{ preset: "islands#redCircleDotIcon" }} />
            {
              filteredEvents.map((event, id) => {
                const geometry = [event.location.lng, event.location.lat];
                return (<Placemark key={id} geometry={geometry} />)
              })
            }
            <Circle geometry={[location, filter['location'] /*metrs*/]} />
          </Map>
        </YMaps>
      </Div>
      <EventCardList events={filteredEvents} filter={filter} setFilter={setFilter} />
    </Panel>
  );
};

export default LocationEvents;
