import { ExtensionContext, languages } from 'coc.nvim';
import { EnvCompletionProvider } from './completion';

export async function activate(context: ExtensionContext): Promise<void> {
  const provider = new EnvCompletionProvider();

  context.subscriptions.push(
    languages.registerCompletionItemProvider('cov-dotenv', 'DOTENV', ['typescript', 'javascript'], provider, [])
  );
}
