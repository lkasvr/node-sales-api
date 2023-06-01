import handlebars from 'handlebars';
import fs from 'fs';

export type TemplateVariable = {
  [key: string]: string | number;
};

export interface IParseMailTemplate {
  file: string;
  variables: TemplateVariable;
}

export default class HandlebarsMailTemplate {
  public async parse({ file, variables }: IParseMailTemplate): Promise<string> {
    const templateFileContent = await fs.promises.readFile(file, {
      encoding: 'utf-8',
    });
    const parseTemplate = handlebars.compile(templateFileContent);

    return parseTemplate(variables);
  }
}
