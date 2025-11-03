import React, { useEffect, useState, useMemo } from "react";
import { FlatList, RefreshControl, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Appbar, Text, ActivityIndicator, FAB } from "react-native-paper";
import ActivityCard from "../components/ActivityCard";
import FiltersBar from "../components/FiltersBar";
import ActivityStats from "../components/ActivityStats";
import { useFilters } from "../contexts/FiltersContext";
import axios from "axios";

export default function ActivitiesScreen({ navigation }) {
  const { filters } = useFilters();
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = async () => {
    try {
      const resp = await axios.get("http://localhost:4000/activities", {
        timeout: 2000,
      });
      setActivities(resp.data);
    } catch (e) {
      const resp = require("../api/mockActivities.json");
      setActivities(resp.activities);
    }
  };

  useEffect(() => {
    setLoading(true);
    fetchData().finally(() => setLoading(false));
  }, []);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, []);

  const filteredAndSorted = useMemo(() => {
    let filtered = activities.filter((a) => {
      // Search
      if (
        filters.search &&
        !a.title.toLowerCase().includes(filters.search.toLowerCase()) &&
        !a.instructor?.toLowerCase().includes(filters.search.toLowerCase()) &&
        !a.module?.toLowerCase().includes(filters.search.toLowerCase())
      ) {
        return false;
      }

      // Type
      if (filters.types.length > 0 && !filters.types.includes(a.type)) {
        return false;
      }

      // Status
      if (filters.status) {
        const activityStatus = a.status || a.submission_status;
        if (activityStatus !== filters.status) {
          return false;
        }
      }

      // Program
      if (filters.program && a.program !== filters.program) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      if (filters.sortBy === "date") {
        const dateA = a.scheduled_at || a.due_date || "";
        const dateB = b.scheduled_at || b.due_date || "";
        if (filters.sortOrder === "asc") {
          return dateA.localeCompare(dateB);
        } else {
          return dateB.localeCompare(dateA);
        }
      } else if (filters.sortBy === "status") {
        const statusA = a.status || a.submission_status || "";
        const statusB = b.status || b.submission_status || "";
        const statusOrder = {
          live: 0,
          upcoming: 1,
          in_progress: 2,
          not_started: 3,
          completed: 4,
          submitted: 4,
          overdue: 5,
          missed: 6,
        };
        const orderA = statusOrder[statusA] ?? 99;
        const orderB = statusOrder[statusB] ?? 99;
        if (filters.sortOrder === "asc") {
          return orderA - orderB;
        } else {
          return orderB - orderA;
        }
      } else if (filters.sortBy === "type") {
        const typeOrder = {
          class: 0,
          assignment: 1,
          quiz: 2,
          discussion: 3,
        };
        const orderA = typeOrder[a.type] ?? 99;
        const orderB = typeOrder[b.type] ?? 99;
        if (filters.sortOrder === "asc") {
          return orderA - orderB;
        } else {
          return orderB - orderA;
        }
      }
      return 0;
    });

    return filtered;
  }, [activities, filters]);

  const scrollToTop = () => {
  };

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ActivityIndicator size="large" animating />
        <Text style={{ marginTop: 16 }}>Loading activities...</Text>
      </SafeAreaView>
    );
  }

  if (!activities.length) {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <Appbar.Header>
          <Appbar.Content title="Activities" />
        </Appbar.Header>
        <FiltersBar />
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            padding: 20,
          }}
        >
          <Text style={{ fontSize: 16, color: "#666" }}>
            No activities available
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Appbar.Header>
        <Appbar.Content title="Activities" />
      </Appbar.Header>

      <FiltersBar />

      <FlatList
        data={filteredAndSorted}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ActivityCard
            activity={item}
            onPress={() => {
              console.log("Pressed activity:", item.id);
            }}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={<ActivityStats activities={filteredAndSorted} />}
        ListEmptyComponent={
          <View style={{ padding: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 16, color: "#666" }}>
              No activities match your filters
            </Text>
          </View>
        }
        contentContainerStyle={
          filteredAndSorted.length === 0 ? { flex: 1 } : { paddingBottom: 80 }
        }
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={10}
      />

      {Platform.OS === "web" && filteredAndSorted.length > 5 && (
        <FAB
          icon="chevron-up"
          style={{
            position: "absolute",
            right: 16,
            bottom: 16,
          }}
          onPress={scrollToTop}
          small
        />
      )}
    </SafeAreaView>
  );
}
