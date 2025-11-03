import React from "react";
import { StyleSheet, View } from "react-native";
import {
  Card,
  Text,
  Button,
  Chip,
  Avatar,
  ProgressBar,
  Icon,
} from "react-native-paper";

export default function ActivityCard({ activity, onPress }) {
  const isClass = activity.type === "class";
  const isAssignment = activity.type === "assignment";
  const isQuiz = activity.type === "quiz";
  const isDiscussion = activity.type === "discussion";

  const getStatusInfo = () => {
    const status = activity.status || activity.submission_status;
    switch (status) {
      case "live":
        return { color: "#f44336", label: "Live", icon: "circle" };
      case "upcoming":
        return { color: "#2196f3", label: "Upcoming", icon: "clock-outline" };
      case "in_progress":
        return { color: "#ff9800", label: "In Progress", icon: "progress-clock" };
      case "completed":
      case "submitted":
        return { color: "#4caf50", label: "Completed", icon: "check-circle" };
      case "overdue":
        return { color: "#f44336", label: "Overdue", icon: "alert-circle" };
      case "missed":
        return { color: "#9e9e9e", label: "Missed", icon: "close-circle" };
      case "not_started":
        return { color: "#757575", label: "Not Started", icon: "clock-outline" };
      default:
        return { color: "#757575", label: status, icon: "help-circle" };
    }
  };

  const statusInfo = getStatusInfo();

  const isUrgent = () => {
    if (isClass) return false;
    if (!activity.due_date) return false;
    const dueDate = new Date(activity.due_date);
    const now = new Date();
    const hoursUntilDue = (dueDate - now) / (1000 * 60 * 60);
    return hoursUntilDue <= 24 && hoursUntilDue > 0 && activity.status !== "completed";
  };

  const urgent = isUrgent();

  const formatDateTime = () => {
    if (isClass && activity.scheduled_at) {
      const date = new Date(activity.scheduled_at);
      const isToday = new Date().toDateString() === date.toDateString();
      if (isToday) {
        return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      return date.toLocaleString([], { 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      });
    }
    if (!isClass && activity.due_date) {
      const date = new Date(activity.due_date);
      const isToday = new Date().toDateString() === date.toDateString();
      if (isToday) {
        return `Due today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
      }
      return `Due: ${date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}`;
    }
    return "";
  };

  const getTypeLabel = () => {
    if (isClass) return "Class";
    if (isAssignment) return "Assignment";
    if (isQuiz) return "Quiz";
    if (isDiscussion) return "Discussion";
    return "Activity";
  };

  const getActionLabel = () => {
    if (isClass) {
      switch (activity.status) {
        case "live":
          return "Join Now";
        case "completed":
          return "View Recording";
        case "missed":
          return "View Recording";
        case "upcoming":
          return "Set Reminder";
        default:
          return "View Details";
      }
    } else {
      switch (activity.submission_status || activity.status) {
        case "completed":
        case "submitted":
          return "Review";
        case "in_progress":
          return "Continue";
        case "overdue":
          return "Submit Now";
        default:
          return isQuiz ? "Start Quiz" : isDiscussion ? "Join Discussion" : "Start";
      }
    }
  };

  const getAvatarLabel = () => {
    if (isClass) return "C";
    if (isAssignment) return "A";
    if (isQuiz) return "Q";
    if (isDiscussion) return "D";
    return "?";
  };

  const subtitle = isClass
    ? activity.instructor 
      ? `${activity.instructor} • ${activity.module || ""}`
      : activity.module || ""
    : `${activity.module || ""} • ${activity.program || ""}`;

  return (
    <Card 
      style={[
        styles.card,
        urgent && styles.urgentCard,
        activity.status === "overdue" && styles.overdueCard
      ]}
      onPress={onPress}
      mode="elevated"
    >
      <Card.Title
        title={activity.title}
        subtitle={subtitle}
        titleNumberOfLines={2}
        subtitleNumberOfLines={2}
        left={(props) => (
          <Avatar.Text 
            {...props} 
            label={getAvatarLabel()} 
            size={48}
            style={[
              styles.avatar,
              isClass && styles.classAvatar,
              isAssignment && styles.assignmentAvatar,
              isQuiz && styles.quizAvatar,
              isDiscussion && styles.discussionAvatar
            ]}
          />
        )}
        right={(props) => (
          <View style={styles.statusContainer}>
            <Chip 
              compact 
              style={[styles.statusChip, { backgroundColor: statusInfo.color + "20" }]}
              textStyle={{ color: statusInfo.color, fontSize: 11 }}
              icon={() => <Icon source={statusInfo.icon} size={14} color={statusInfo.color} />}
            >
              {statusInfo.label}
            </Chip>
            {urgent && (
              <Chip 
                compact 
                style={[styles.urgentChip, { backgroundColor: "#f4433620" }]}
                textStyle={{ color: "#f44336", fontSize: 10 }}
                icon="alert"
              >
                Urgent
              </Chip>
            )}
          </View>
        )}
      />
      <Card.Content>
        <View style={styles.metaRow}>
          <Text style={styles.typeLabel}>{getTypeLabel()}</Text>
          {activity.points && (
            <Text style={styles.points}>{activity.points} points</Text>
          )}
          {activity.score !== null && activity.score !== undefined && (
            <Text style={styles.score}>
              Score: {activity.score}{activity.points ? `/${activity.points}` : ""}
            </Text>
          )}
        </View>
        
        <View style={styles.dateRow}>
          <Icon source="calendar-clock" size={16} />
          <Text style={styles.dateText}>{formatDateTime()}</Text>
        </View>

        {isClass && activity.duration_mins && (
          <View style={styles.dateRow}>
            <Icon source="timer-outline" size={16} />
            <Text style={styles.dateText}>{activity.duration_mins} minutes</Text>
          </View>
        )}

        {!isClass && activity.attempts_allowed && (
          <View style={styles.dateRow}>
            <Icon source="repeat" size={16} />
            <Text style={styles.dateText}>
              {activity.attempts_used || 0}/{activity.attempts_allowed} attempts
            </Text>
          </View>
        )}

        {typeof activity.progress_percent === "number" && activity.progress_percent > 0 && (
          <View style={styles.progressContainer}>
            <ProgressBar
              progress={activity.progress_percent / 100}
              color={statusInfo.color}
              style={styles.progressBar}
            />
            <Text style={styles.progressText}>{activity.progress_percent}% complete</Text>
          </View>
        )}
      </Card.Content>
      <Card.Actions>
        <Button 
          mode={urgent || activity.status === "overdue" ? "contained" : "outlined"}
          onPress={onPress}
          buttonColor={urgent || activity.status === "overdue" ? "#f44336" : undefined}
          contentStyle={styles.actionButton}
        >
          {getActionLabel()}
        </Button>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginVertical: 6,
    marginHorizontal: 12,
  },
  urgentCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
  },
  overdueCard: {
    borderLeftWidth: 4,
    borderLeftColor: "#f44336",
    backgroundColor: "#ffebee",
  },
  avatar: {
    backgroundColor: "#e0e0e0",
  },
  classAvatar: {
    backgroundColor: "#2196f3",
  },
  assignmentAvatar: {
    backgroundColor: "#ff9800",
  },
  quizAvatar: {
    backgroundColor: "#9c27b0",
  },
  discussionAvatar: {
    backgroundColor: "#4caf50",
  },
  statusContainer: {
    flexDirection: "column",
    alignItems: "flex-end",
    gap: 4,
  },
  statusChip: {
    height: 24,
  },
  urgentChip: {
    height: 20,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 8,
  },
  typeLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
    textTransform: "uppercase",
  },
  points: {
    fontSize: 12,
    color: "#666",
    marginLeft: "auto",
  },
  score: {
    fontSize: 12,
    color: "#4caf50",
    fontWeight: "600",
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    gap: 6,
  },
  dateText: {
    fontSize: 13,
    color: "#666",
  },
  progressContainer: {
    marginTop: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
    marginBottom: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
  },
  actionButton: {
    paddingHorizontal: 16,
  },
});
