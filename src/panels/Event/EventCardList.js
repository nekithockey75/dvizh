import React, { useState, useEffect } from "react";
import PropTypes, { element } from "prop-types";
import {
  Group,
  CardGrid,
  CellButton,
  View,
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  Title,
} from "@vkontakte/vkui";

import Icon24Sort from "@vkontakte/icons/dist/24/sort";

import EventCard from "./EventCard";
import Filter from "../../utils/Filter";
import FilterPanel from "./FilterPanel";

const MAIN_MODAL = "main-modal";

const ProjectCardList = (props) => {
  const { events, filter, setFilter } = props;
  const [currentModal, setCurrentModal] = useState(null);
  const [innerFilter, setInnerFilter] = useState(filter);
  
  
  useEffect(() => {
    setInnerFilter(filter);
  }, []);
  
  
  const updateFilter = (data) => {
    const { key, value } = data;
    setInnerFilter({
      ...filter,
      [key]: value
    })
  }
  
  let filteredEvents = events.filter((element) => {
    return element;
  });
  
  const filterModal = (
    <ModalRoot
    activeModal={currentModal}
    onClose={() => {
      setCurrentModal(null);
      setFilter(innerFilter);
      filteredEvents = events.filter((element) => {
        return element;
      });
    }}
    >
      <ModalPage
        id={MAIN_MODAL}
        header={<ModalPageHeader><Title level="2">Фильтры</Title></ModalPageHeader>}
        dynamicContentHeight
        >
        <FilterPanel filterValues={innerFilter} onUpdate={updateFilter} />
      </ModalPage>
    </ModalRoot>
  );
  
  return (
    <View modal={filterModal}>
      <Group
        separator="hide"
        header={
          <CellButton
            before={<Icon24Sort />}
            onClick={() => {
              setCurrentModal(MAIN_MODAL);
            }}
          >
            Фильтровать
          </CellButton>
        }
      >
        <CardGrid>
          {events.map((event, key) => (
            <EventCard key={key} event={event} />
          ))}
        </CardGrid>
      </Group>
    </View>
  );
};

ProjectCardList.propTypes = {
  events: PropTypes.array.isRequired,
  filter: PropTypes.objectOf(Filter).isRequired,
  setFilter: PropTypes.func.isRequired
};

export default ProjectCardList;
