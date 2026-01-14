import type { FC } from "react";
import { Formik } from "formik";

interface RepeatFormProps {
  onSubmit: (videoId: string) => void;
}

const RepeatForm: FC<RepeatFormProps> = ({ onSubmit }) => (
  <Formik
    initialValues={{ videoId: "" }}
    onSubmit={(values, { setSubmitting, resetForm }) => {
      const trimmed = values.videoId.trim();

      if (!trimmed) {
        setSubmitting(false);
        return;
      }

      onSubmit(trimmed);
      resetForm();
    }}
  >
    {({ values, handleChange, handleSubmit, isSubmitting }) => (
      <form className="repeat-form" onSubmit={handleSubmit}>
        <input
          className="repeat-form__input"
          name="videoId"
          placeholder="Enter a YouTube video ID"
          onChange={handleChange}
          value={values.videoId}
          required
          autoComplete="off"
        />
        <button
          className="primary-button"
          type="submit"
          disabled={isSubmitting || values.videoId.trim().length === 0}
        >
          Play
        </button>
      </form>
    )}
  </Formik>
);

export default RepeatForm;
