
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CreateNoteDto, NoteTag, Note } from '../../types/note';
import { createNote } from '@/lib/api';
import css from './NoteForm.module.css';

const TAGS: NoteTag[] = ['Todo', 'Work', 'Personal', 'Meeting', 'Shopping'];

const schema = Yup.object({
  title: Yup.string().min(3, 'Min 3').max(50, 'Max 50').required('Title is required'),
  content: Yup.string().max(500, 'Max 500'),
  tag: Yup.mixed<NoteTag>().oneOf(TAGS, 'Invalid tag').required('Tag is required'),
});

export interface NoteFormProps {
  onCancel: () => void;
}

export function NoteForm({ onCancel }: NoteFormProps) {
  const queryClient = useQueryClient();

  // Мутація створення нотатки + інвалідація кешу списку нотаток
  const createMut = useMutation<Note, Error, CreateNoteDto>({
    mutationFn: createNote,
    onSuccess: () => {
      // оновлюємо всі запити по нотатках (включно з пошуком/сторінками)
      queryClient.invalidateQueries({ queryKey: ['notes'] });
      onCancel();
    },
  });

  const handleCancelClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    onCancel();
  };

  return (
    <Formik<CreateNoteDto>
      initialValues={{ title: '', content: '', tag: 'Todo' }}
      validationSchema={schema}
      onSubmit={(values, helpers) => {
        createMut.mutate(values, {
          onSuccess: () => helpers.resetForm(),
        });
      }}
    >
      {({ isValid }) => (
        <Form className={css.form}>
          <div className={css.formGroup}>
            <label htmlFor="title">Title</label>
            <Field id="title" type="text" name="title" className={css.input} />
            <ErrorMessage name="title" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="content">Content</label>
            <Field as="textarea" id="content" name="content" rows={8} className={css.textarea} />
            <ErrorMessage name="content" component="span" className={css.error} />
          </div>

          <div className={css.formGroup}>
            <label htmlFor="tag">Tag</label>
            <Field as="select" id="tag" name="tag" className={css.select}>
              {TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Field>
            <ErrorMessage name="tag" component="span" className={css.error} />
          </div>

          <div className={css.actions}>
            <button
              type="button"
              className={css.cancelButton}
              onClick={handleCancelClick}
              disabled={createMut.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={css.submitButton}
              disabled={!isValid || createMut.isPending}
            >
              {createMut.isPending ? 'Creating...' : 'Create note'}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default NoteForm;

