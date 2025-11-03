import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, Text, Icon } from "react-native-paper";

export default function ActivityStats({ activities }) {
  const stats = {
    total: activities.length,
    upcoming: activities.filter(a => a.status === "upcoming" || (a.type === "class" && a.status === "upcoming")).length,
    inProgress: activities.filter(a => a.status === "in_progress" || a.submission_status === "in_progress").length,
    completed: activities.filter(a => a.status === "completed" || a.submission_status === "submitted").length,
    overdue: activities.filter(a => a.status === "overdue" || a.submission_status === "overdue").length,
    classes: activities.filter(a => a.type === "class").length,
    assessments: activities.filter(a => a.type !== "class").length,
  };

  const StatItem = ({ icon, label, value, color = "#666" }) => (
    <View style={styles.statItem}>
      <Icon source={icon} size={20} color={color} />
      <View style={styles.statText}>
        <Text style={[styles.statValue, { color }]}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content>
        <Text style={styles.title}>Activity Overview</Text>
        <View style={styles.statsGrid}>
          <StatItem 
            icon="calendar-clock" 
            label="Upcoming" 
            value={stats.upcoming} 
            color="#2196f3" 
          />
          <StatItem 
            icon="progress-clock" 
            label="In Progress" 
            value={stats.inProgress} 
            color="#ff9800" 
          />
          <StatItem 
            icon="check-circle" 
            label="Completed" 
            value={stats.completed} 
            color="#4caf50" 
          />
          <StatItem 
            icon="alert-circle" 
            label="Overdue" 
            value={stats.overdue} 
            color="#f44336" 
          />
          <StatItem 
            icon="school" 
            label="Classes" 
            value={stats.classes} 
            color="#2196f3" 
          />
          <StatItem 
            icon="file-document" 
            label="Assessments" 
            value={stats.assessments} 
            color="#9c27b0" 
          />
        </View>
        <View style={styles.totalContainer}>
          <Text style={styles.totalText}>Total Activities: {stats.total}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: "45%",
    gap: 8,
  },
  statText: {
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  totalContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
  },
  totalText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
});

