import * as React from 'react';
import { AnalysisMode } from '../core/view-model/view-config';
import { analyzeClassSource } from '../core/parsers/typescript/class-based/analyzeClassSource';
import { analyzeModuleSource } from '../core/parsers/typescript/module-based/analyzeModuleSource';
import { ConfigurableMatrix } from './ConfigurableMatrix';
import { ErrorBoundary } from './ErrorBoundary';

interface SourceMatrixProps {
  mode: AnalysisMode;
  source: string;
}

export function SourceMatrix(props: SourceMatrixProps) {
  if (!props.source) {
    return null;
  }

  try {
    let members;
    switch (props.mode) {
      case 'class':
        members = analyzeClassSource(props.source);
        break;
      case 'module':
        members = analyzeModuleSource(props.source);
        break;
      default:
        members = [];
    }

    if (!members.length) {
      return (
        <Error>
          Couldn't parse code. If this is a file Source Viz should support
          please open an issue at{' '}
          <a href="https://github.com/cowchimp/source-viz">
            https://github.com/cowchimp/source-viz
          </a>
          .
        </Error>
      );
    }

    return (
      <ErrorBoundary renderError={(e) => <InternalError e={e} />}>
        <ConfigurableMatrix members={members} />
      </ErrorBoundary>
    );
  } catch (e) {
    return <InternalError e={e} />;
  }
}

function InternalError({ e }) {
  return (
    <Error>
      Error message: {e.message}
      <br />
      Please open an issue at{' '}
      <a href="https://github.com/cowchimp/source-viz">
        https://github.com/cowchimp/source-viz
      </a>
      .
    </Error>
  );
}

function Error({ children }) {
  return <div className="error">⚠️ {children}</div>;
}
