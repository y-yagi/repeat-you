import React from "react";
import { Formik } from "formik";
import { Form, Button } from "semantic-ui-react";

const RepeatForm = (callback) => (
  <Formik
    initialValues={{ videoId: "" }}
    onSubmit={(values, { setSubmitting }) => {
      callback(values);
    }}
  >
    {({
      values,
      handleChange,
      handleSubmit,
      isSubmitting,
      /* and other goodies */
    }) => (
      <Form onSubmit={handleSubmit}>
        <Form.Field>
          <input
            name="videoId"
            placeholder="video ID"
            onChange={handleChange}
            value={values.videoId}
            required={true}
          />
        </Form.Field>
        <Button type="submit" disabled={isSubmitting}>
          Play
        </Button>
      </Form>
    )}
  </Formik>
);

export default RepeatForm;
