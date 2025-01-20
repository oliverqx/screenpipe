import { FieldSchema } from "@/modules/form/entities/field/field-metadata"

const fields: FieldSchema[] = [
  {
    key: 'endpointUrl',
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
    validationMeta: {
     optional: false,
     errorMessage: 'hey' 
    },
    typeMeta: {
      isRegular: false,
      type: 'SELECT', 
      options: [
        {
          value: "gpt-4o",
          label: "gpt-4o"
        },
        {
          value: "gpt-4o-mini",
          label: "gpt-4o-mini"
        },
        {
          value: "o1-mini",
          label: "o1-mini",
        },
        {
          value: "o1",
          label: "o1"
        },
      ]
    }
  },
  {
    key: 'prompt',
    title: 'prompt',
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
    key: 'maxContent',
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

export const CustomSetupForm = {
  title: 'custom provider setup',
  fields,
  buttonText: 'submit changes',
}