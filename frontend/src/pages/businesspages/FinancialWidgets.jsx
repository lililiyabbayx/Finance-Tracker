import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  IconButton,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const FinancialWidgets = () => {
  const [widgets, setWidgets] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentWidget, setCurrentWidget] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchWidgets = async () => {
      try {
        const response = await axios.get("http://localhost:3300/api/v1/financial-widgets");
        setWidgets(response.data);
      } catch (error) {
        console.error("Failed to fetch financial widgets", error);
      }
    };

    fetchWidgets();
  }, []);

  const handleOpenDialog = (widget = null) => {
    setCurrentWidget(widget || { name: "", value: "" });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentWidget(null);
  };

  const handleSaveWidget = async () => {
    try {
      if (currentWidget._id) {
        // Edit existing widget
        const response = await axios.put(`http://localhost:3300/api/v1/financial-widgets/${currentWidget._id}`, currentWidget);
        setWidgets((prev) =>
          prev.map((w) =>
            w._id === currentWidget._id ? response.data : w
          )
        );
      } else {
        // Add new widget
        const response = await axios.post("http://localhost:3300/api/v1/financial-widgets", currentWidget);
        setWidgets((prev) => [
          ...prev,
          response.data,
        ]);
      }
      setOpenSnackbar(true);
      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save widget", error);
    }
  };

  const handleDeleteWidget = async (id) => {
    try {
      await axios.delete(`http://localhost:3300/api/v1/financial-widgets/${id}`);
      setWidgets((prev) => prev.filter((w) => w._id !== id));
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Failed to delete widget", error);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <Typography variant="h4" gutterBottom>
        Financial Widgets
      </Typography>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={() => handleOpenDialog()}
      >
        Add Widget
      </Button>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {widgets.map((widget, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6">{widget.name}</Typography>
                <Typography variant="body2">{widget.value}</Typography>
                <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                  <IconButton onClick={() => handleOpenDialog(widget)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDeleteWidget(widget._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentWidget ? "Edit" : "Add"} Widget</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Widget Name"
            type="text"
            fullWidth
            variant="outlined"
            value={currentWidget ? currentWidget.name : ""}
            onChange={(e) =>
              setCurrentWidget({
                ...currentWidget,
                name: e.target.value,
              })
            }
          />
          <TextField
            margin="dense"
            label="Value"
            type="text"
            fullWidth
            variant="outlined"
            value={currentWidget ? currentWidget.value : ""}
            onChange={(e) =>
              setCurrentWidget({
                ...currentWidget,
                value: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveWidget}>Save</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity="success">
          Widget saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FinancialWidgets;