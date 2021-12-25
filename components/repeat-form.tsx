import React from "react";
import { Formik } from "formik";
import { Form, Button } from "semantic-ui-react";

const RepeatForm = (callback: any) => (
  <Formik
    initialValues={{ videoId: "" }}
    onSubmit={(values, { setSubmitting }) => {
      callback(values);
    }}
  >
    {({ values, handleChange, handleSubmit }) => (
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
        <Button type="submit">Play</Button>
      </Form>
    )}
  </Formik>
);

export default RepeatForm;
