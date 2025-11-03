import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Platform } from "react-native";
import { Searchbar, Chip, Menu } from "react-native-paper";
import { useFilters } from "../contexts/FiltersContext";

const ACTIVITY_TYPES = [
  { label: "All", value: null },
  { label: "Class", value: "class" },
  { label: "Assignment", value: "assignment" },
  { label: "Quiz", value: "quiz" },
  { label: "Discussion", value: "discussion" },
];

const STATUS_FILTERS = [
  { label: "All", value: null },
  { label: "Upcoming", value: "upcoming" },
  { label: "Live", value: "live" },
  { label: "In Progress", value: "in_progress" },
  { label: "Completed", value: "completed" },
  { label: "Overdue", value: "overdue" },
  { label: "Not Started", value: "not_started" },
];

const SORT_OPTIONS = [
  { label: "Date (Newest First)", value: "date", order: "desc" },
  { label: "Date (Oldest First)", value: "date", order: "asc" },
  { label: "Status", value: "status", order: "asc" },
  { label: "Type", value: "type", order: "asc" },
];

export default function FiltersBar() {
  const { filters, setFilters } = useFilters();
  const [programMenuVisible, setProgramMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [sortMenuVisible, setSortMenuVisible] = useState(false);

  const toggleType = (type) => {
    if (type === null) {
      setFilters({ types: [] });
      return;
    }
    const selected = filters.types.includes(type)
      ? filters.types.filter((x) => x !== type)
      : [...filters.types, type];
    setFilters({ types: selected });
  };

  const getAvailablePrograms = (activities) => {
    return ["All Programs", "AI & Machine Learning", "Cloud Computing"];
  };

  const activeFiltersCount = 
    (filters.types.length > 0 ? 1 : 0) +
    (filters.status ? 1 : 0) +
    (filters.program ? 1 : 0) +
    (filters.sortBy !== "date" || filters.sortOrder !== "asc" ? 1 : 0);

  return (
    <View style={styles.container}>
      <View style={styles.searchRow}>
        <Searchbar
          placeholder="Search activities..."
          value={filters.search}
          onChangeText={(text) => setFilters({ search: text })}
          style={styles.searchbar}
          icon="magnify"
          clearIcon="close-circle"
        />
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {/* Activity */}
        <View style={styles.filterGroup}>
          {ACTIVITY_TYPES.map((type) => {
            const isAll = type.value === null;
            const isSelected = isAll 
              ? filters.types.length === 0 
              : filters.types.includes(type.value);
            
            return (
              <Chip
                key={type.value || "all"}
                onPress={() => toggleType(type.value)}
                selected={isSelected}
                style={styles.chip}
                selectedColor="#2196f3"
              >
                {type.label}
              </Chip>
            );
          })}
        </View>

        {/* Status  */}
        <Menu
          visible={statusMenuVisible}
          onDismiss={() => setStatusMenuVisible(false)}
          anchor={
            <Chip
              onPress={() => setStatusMenuVisible(true)}
              style={[styles.chip, filters.status && styles.chipActive]}
              icon="filter"
              selected={!!filters.status}
            >
              Status: {filters.status ? STATUS_FILTERS.find(s => s.value === filters.status)?.label : "All"}
            </Chip>
          }
        >
          {STATUS_FILTERS.map((status) => (
            <Menu.Item
              key={status.value || "all"}
              onPress={() => {
                setFilters({ status: status.value });
                setStatusMenuVisible(false);
              }}
              title={status.label}
              leadingIcon={filters.status === status.value ? "check" : undefined}
            />
          ))}
        </Menu>

        {/* Program */}
        <Menu
          visible={programMenuVisible}
          onDismiss={() => setProgramMenuVisible(false)}
          anchor={
            <Chip
              onPress={() => setProgramMenuVisible(true)}
              style={[styles.chip, filters.program && styles.chipActive]}
              icon="book-open-variant"
              selected={!!filters.program}
            >
              {filters.program || "All Programs"}
            </Chip>
          }
        >
          <Menu.Item
            onPress={() => {
              setFilters({ program: null });
              setProgramMenuVisible(false);
            }}
            title="All Programs"
            leadingIcon={!filters.program ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => {
              setFilters({ program: "AI & Machine Learning" });
              setProgramMenuVisible(false);
            }}
            title="AI & Machine Learning"
            leadingIcon={filters.program === "AI & Machine Learning" ? "check" : undefined}
          />
          <Menu.Item
            onPress={() => {
              setFilters({ program: "Cloud Computing" });
              setProgramMenuVisible(false);
            }}
            title="Cloud Computing"
            leadingIcon={filters.program === "Cloud Computing" ? "check" : undefined}
          />
        </Menu>

        {/* Sort */}
        <Menu
          visible={sortMenuVisible}
          onDismiss={() => setSortMenuVisible(false)}
          anchor={
            <Chip
              onPress={() => setSortMenuVisible(true)}
              style={[styles.chip, (filters.sortBy !== "date" || filters.sortOrder !== "asc") && styles.chipActive]}
              icon="sort"
            >
              Sort
            </Chip>
          }
        >
          {SORT_OPTIONS.map((option, idx) => (
            <Menu.Item
              key={idx}
              onPress={() => {
                setFilters({ sortBy: option.value, sortOrder: option.order });
                setSortMenuVisible(false);
              }}
              title={option.label}
              leadingIcon={
                filters.sortBy === option.value && filters.sortOrder === option.order
                  ? "check"
                  : undefined
              }
            />
          ))}
        </Menu>

        {/* Clear */}
        {activeFiltersCount > 0 && (
          <Chip
            onPress={() => setFilters({ 
              types: [], 
              status: null, 
              program: null,
              sortBy: "date",
              sortOrder: "asc"
            })}
            style={styles.clearChip}
            icon="close-circle"
          >
            Clear ({activeFiltersCount})
          </Chip>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Platform.OS === "web" ? "#f5f5f5" : undefined,
    paddingBottom: 8,
  },
  searchRow: {
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  searchbar: {
    elevation: 2,
  },
  filtersScroll: {
    maxHeight: Platform.OS === "web" ? 120 : undefined,
  },
  filtersContent: {
    paddingHorizontal: 8,
    paddingTop: 8,
    alignItems: "center",
    gap: 8,
  },
  filterGroup: {
    flexDirection: "row",
    gap: 8,
  },
  chip: {
    marginRight: 4,
  },
  chipActive: {
    backgroundColor: "#2196f3",
  },
  clearChip: {
    backgroundColor: "#ffebee",
  },
});
