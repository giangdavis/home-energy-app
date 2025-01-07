import React, { useState } from "react";
import axios from "axios";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Label } from "./ui/Label";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/Popover";
import { Calendar } from "./ui/Calendar";

const initialValues = {
  date: "",
  usage: "",
};

const SingleEntryForm = ({ userId }) => {
  const [values, setValues] = useState(initialValues);
  const [result, setResult] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState(null);
  const [showError, setShowError] = useState(false); // New state to track validation errors

  // Handle input change for energy usage
  const handleUsageChange = (event) => {
    setValues((prevValues) => ({
      ...prevValues,
      usage: event.target.value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setShowError(true); // Trigger validation check on submit
    setResult("");

    // Validate the form
    if (!date || !values.usage) {
      setResult("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token not found. Please sign in again.");
      }

      // Axios request to save energy data
      await axios.post(
        "https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/input",
        {
          userId,
          date: values.date || format(date, "yyyy-MM-dd"),
          usage: Number(values.usage),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setResult("Energy data saved successfully");
      setValues(initialValues);
      setDate(null);
      setShowError(false); 
    } catch (error) {
      console.error("Submission error:", error);
      let errorMessage = "Failed to save energy data: ";

      if (error.response) {
        errorMessage +=
          error.response.data?.error ||
          error.response.data?.message ||
          error.message;
        if (error.response.status === 401 || error.response.status === 403) {
          errorMessage = "Authentication error. Please sign in again.";
        }
      } else if (error.request) {
        errorMessage += "No response from server. Please check your connection.";
      } else {
        errorMessage += error.message;
      }

      setResult(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset the form after successful submission
  const handleReset = () => {
    setValues(initialValues);
    setDate(null);
    setResult("");
    setIsSubmitting(false);
    setShowError(false); // Reset validation state
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Energy Usage Form</CardTitle>
        <CardDescription>Record your daily energy consumption</CardDescription>
      </CardHeader>

      {/* 1) The Date Picker sits OUTSIDE the form */}
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={`w-full justify-start text-left font-normal ${
                  !date ? "text-muted-foreground" : ""
                }`}
              >
                <CalendarIcon className="mr-2 h-4 w-4 inline-block" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
            />
            </PopoverContent>
          </Popover>
          {showError && !date && (
            <p className="text-red-500 text-sm">Please select a date.</p>
          )}
        </div>
      </CardContent>

      {/* 2) The form now ONLY contains the energy usage and the submit button */}
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="usage">Energy Usage (kWh)</Label>
            <Input
              id="usage"
              placeholder="Enter energy usage"
              type="number"
              step="0.01"
              min="0"
              value={values.usage}
              onChange={handleUsageChange}
              disabled={isSubmitting}
            />
            {showError && !values.usage && (
              <p className="text-red-500 text-sm">Please enter your energy usage.</p>
            )}
          </div>
        </CardContent>

        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Submitting..." : "Submit"}
          </Button>
        </CardFooter>
      </form>

      {/* Result Message */}
      {result && (
        <CardFooter>
          <p style={{ color: result.includes("successfully") ? "green" : "red" }}>
            {result}
          </p>
        </CardFooter>
      )}

      {/* Reset Button */}
      {result && (
        <CardFooter>
          <Button onClick={handleReset} className="w-full">
            Submit Another Entry
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default SingleEntryForm;
