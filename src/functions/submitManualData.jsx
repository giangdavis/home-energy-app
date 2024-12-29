function handleSubmit(event) {
    event.preventDefault();
 
    axios
      .post(
        "https://bhdzt2k39g.execute-api.us-west-2.amazonaws.com/energy/input",
        {
          name: values.name,
          year: values.year,
          usage: values.usage,
        }
      )
      .then((response) => {
        console.log(response);
        setResult("Energy data saved successfully")
 
      })
      .catch((error) => {
        console.log(error);
        setResult("Something went wrong!")
      });
 }