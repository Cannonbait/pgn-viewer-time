import { h } from 'snabbdom';
import Ctrl from '../ctrl';
import { GoTo } from '../interfaces';
import { bind, bindMobileMousedown, onInsert } from './util';
import { eventRepeater } from '../events';

export const renderMenu = (ctrl: Ctrl) =>
  h('div.lpv__menu.lpv__pane', [
    h(
      'button.lpv__menu__entry.lpv__menu__flip.lpv__fbt',
      {
        hook: bind('click', ctrl.flip),
      },
      ctrl.translate('flipTheBoard')
    ),
    h(
      'a.lpv__menu__entry.lpv__menu__analysis.lpv__fbt',
      {
        attrs: {
          href: ctrl.analysisUrl(),
          target: '_blank',
        },
      },
      ctrl.translate('analysisBoard')
    ),
    h(
      'a.lpv__menu__entry.lpv__menu__practice.lpv__fbt',
      {
        attrs: {
          href: ctrl.practiceUrl(),
          target: '_blank',
        },
      },
      ctrl.translate('practiceWithComputer')
    ),
    ctrl.opts.menu.getPgn.enabled
      ? h(
          'button.lpv__menu__entry.lpv__menu__pgn.lpv__fbt',
          {
            hook: bind('click', ctrl.togglePgn),
          },
          ctrl.translate('getPgn')
        )
      : undefined,
    renderExternalLink(ctrl),
  ]);

const renderExternalLink = (ctrl: Ctrl) => {
  const link = ctrl.game.metadata.externalLink;
  return (
    link &&
    h(
      'a.lpv__menu__entry.lpv__fbt',
      {
        attrs: {
          href: link,
          target: '_blank',
        },
      },
      ctrl.translate(ctrl.game.metadata.isLichess ? 'viewOnLichess' : 'viewOnSite')
    )
  );
};

export const renderControls = (ctrl: Ctrl) =>
  h('div.lpv__controls', [
    ctrl.pane == 'board' ? undefined : dirButton(ctrl, 'first', 'step-backward'),
    dirButton(ctrl, 'prev', 'left-open'),
    h(
      'button.lpv__fbt.lpv__controls__menu.icon',
      {
        class: {
          active: ctrl.pane != 'board',
          'icon-ellipsis-vert': ctrl.pane == 'board',
        },
        hook: bind('click', ctrl.toggleMenu),
      },
      ctrl.pane == 'board' ? undefined : 'X'
    ),
    dirButton(ctrl, 'next', 'right-open'),
    ctrl.pane == 'board' ? undefined : dirButton(ctrl, 'last', 'step-forward'),
  ]);

const dirButton = (ctrl: Ctrl, to: GoTo, icon: string) =>
  h(`button.lpv__controls__goto.lpv__controls__goto--${to}.lpv__fbt.icon.icon-${icon}`, {
    class: { disabled: ctrl.pane == 'board' && !ctrl.canGoTo(to) },
    hook: onInsert(el => bindMobileMousedown(el, e => eventRepeater(() => ctrl.goTo(to), e))),
  });
