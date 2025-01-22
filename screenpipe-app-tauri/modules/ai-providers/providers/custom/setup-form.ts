import { FieldSchema } from "@/modules/form/entities/field/field-metadata"
import { FormSchema } from "@/modules/form/entities/form"

const fields: FieldSchema[] = [
  {
    key: 'aiUrl',
    title: 'endpoint url',
    validationMeta: {
      errorMessage: 'this field is mandatory',
      min: 1,
      max: 50,
      optional: false
    },
    typeMeta: {
      isRegular: true,
      type: 'STRING'
    }
  },
  {
    key: 'aiModel',
    title: 'ai model',
    placeholder: 'type model name',
    validationMeta: {
     optional: false,
    },
    typeMeta: {
      isRegular: false,
      type: 'SELECT_CREATEABLE', 
      options: [
      ]
    }
  },
  {
    key: 'customPrompt',
    title: 'prompt',
    placeholder: 'enter your custom prompt here',
    validationMeta: {
      optional: false,
      errorMessage: 'you need to provide a custom prompt'
    },
    typeMeta: {
      isRegular: true,
      type: 'TEXTAREA'
    }
  },
  {
    key: 'aiMaxContextChars',
    title: 'max content',
    validationMeta: {
      optional: false,
      errorMessage: 'you need to provide a custom prompt'
    },
    typeMeta: {
      isRegular: true,
      type: 'SLIDER'
    }
  }
]

export const CustomSetupForm: FormSchema = {
  title: 'configuration',
  fields,
  buttonText: 'submit changes',
}