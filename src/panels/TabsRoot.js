import React, { useState, useEffect } from "react";
import { useRouter, useRoute } from "react-router5";
import View from "@vkontakte/vkui/dist/components/View/View";
import "@vkontakte/vkui/dist/vkui.css";
import { Tabbar, TabbarItem, Epic } from "@vkontakte/vkui";

import Icon28BombOutline from "@vkontakte/icons/dist/28/bomb_outline";
import Icon28PlaceOutline from "@vkontakte/icons/dist/28/place_outline";
import Icon28GhostOutline from "@vkontakte/icons/dist/28/ghost_outline";

import UserProfile from "./UserProfile";
import FriendsEvents from "./FriendsEvents";
import LocationEvents from "./LocationEvents";
import Event from "./Event";

const TABS__ = [
  {
    id: "me",
    text: "Мои",
    icon: <Icon28BombOutline />
  },
  {
    id: "location",
    text: "Рядом",
    icon: <Icon28PlaceOutline />
  },
  {
    id: "friends",
    text: "Друзья",
    icon: <Icon28GhostOutline />
  }
]

const TabsRoot = () => {
  const { route } = useRoute();
  const [activeStory, setActiveStory] = useState(null);
  const router = useRouter();
  const currentTab = TABS__.filter(tab => tab.id === route.name)[0];
  const tabName = currentTab ? currentTab.id : TABS__[0].id;

  useEffect(() => {
    setActiveStory(tabName);
  });

  if (route.name === "event") {
    return (
      <Event />
    );
  }


  const onStoryChange = (e) => {
    const to = e.currentTarget.dataset.story;
    router.navigate(to);
    setActiveStory(to);
  };

  const tabBarComponent = (
    <Tabbar>
      {TABS__.map((element, index) =>
        <TabbarItem
          onClick={onStoryChange}
          selected={activeStory === element.id}
          data-story={element.id}
          text={element.text}
          key={index}
        >
          {element.icon}
        </TabbarItem>
      )}
    </Tabbar>
  );

  return (
    <Epic
      activeStory={activeStory}
      tabbar={
        tabBarComponent
      }
    >
      <View id="me" key="0">
        <UserProfile />
      </View>
      <View id="location" key="1">
        <LocationEvents />
      </View>
      <View id="friends" key="2">
        <FriendsEvents />
      </View>
    </Epic>
  );
};

export default TabsRoot;
