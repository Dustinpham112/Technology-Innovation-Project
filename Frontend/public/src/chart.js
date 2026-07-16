const data = {
  labels: ["TN", "FP", "FN", "TP"],
  datasets: [
    {
      label: "Confusion Matrix",
      data: [
        cm.true_negative,
        cm.false_positive,
        cm.false_negative,
        cm.true_positive
      ]
    }
  ]
};
