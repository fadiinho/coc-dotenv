import {
  Position,
  CompletionItem,
  CompletionItemProvider,
  TextDocument,
  Range,
  workspace,
  CompletionItemKind
} from 'coc.nvim';

import { parse } from 'dotenv';
import { readFileSync } from 'fs';

export class EnvCompletionProvider implements CompletionItemProvider {
  readonly start = Position.create(0, 0);
  readonly pattern = /process\.env/gi;

  async provideCompletionItems(document: TextDocument, position: Position) {
    const { uri } = document;
    const items: CompletionItem[] = await this.getItems();
    if (!items) return [];

    const doc = workspace.getDocument(uri);
    if (!doc) return [];

    const line = doc.getWordRangeAtPosition(Position.create(position.line, position.character + 1))!;

    const word = document.getText(line);
    if (!word) return [];

    const linePre = document.getText(Range.create(Position.create(position.line, 0), position));

    if (this.pattern.exec(linePre)) {
      return items;
    }

    return [];
  }

  private async getItems(): Promise<CompletionItem[]> {
    const dotenvFilePath = (await workspace.findUp('.env')) || '';
    if (!dotenvFilePath) return [];

    const dotenvFile = readFileSync(dotenvFilePath);
    if (!dotenvFile) return [];
    const parsedFile = parse(dotenvFile);
    const items: CompletionItem[] = [];

    for (const key in parsedFile) {
      items.push({
        label: key,
        kind: CompletionItemKind.Text
      });
    }

    return items;
  }
}
