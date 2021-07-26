  
kaboom({
    global: true,
    fullscreen: true,
    scale: 1,
    clearColor: [ 0, 0, 0, 1]
})

const MOVE_SPEED = 120
const SLICER_SPEED = 100
const SKELETOR_SPEED = 60

loadRoot('https://i.imgur.com/')
loadSprite('link-going-left', '1Xq9biB.png')
loadSprite('link-going-right', 'yZIb8O2.png')
loadSprite('link-going-down', 'tVtlP6y.png')
loadSprite('link-going-up', 'UkV0we0.png')
loadSprite('left-wall', 'rfDoaa1.png')
loadSprite('top-wall', 'QA257Bj.png')
loadSprite('bottom-wall', 'vWJWmvb.png')
loadSprite('right-wall', 'SmHhgUn.png')
loadSprite('bottom-left-wall', 'awnTfNC.png')
loadSprite('bottom-right-wall', '84oyTFy.png')
loadSprite('top-left-wall', 'xlpUxIm.png')
loadSprite('top-right-wall', 'z0OmBd1.jpg')
loadSprite('top-door', 'U9nre4n.png')
loadSprite('fire-pot', 'I7xSp7w.png')
loadSprite('left-door', 'okdJNls.png')
loadSprite('lanterns', 'wiSiY09.png')
loadSprite('slicer', 'c6JFi5Z.png')
loadSprite('skeletor', 'Ei1VnX8.png')
loadSprite('kaboom', 'o9WizfI.png')
loadSprite('stairs', 'VghkL08.png')
loadSprite('bg', 'u4DVsx6.png')

const maps = [
    [
      'ycc)cc^ccw',
      'a        b',
      'a      * b',
      'a    (   b',
      '%        b',
      'a    (   b',
      'a   *    b',
      'a        b',
      'xdd)dd)ddz',
    ],
    [
      'yccccccccw',
      'a        b',
      ')        )',
      'a        b',
      'a        b',
      'a    $   b',
      ')   }    )',
      'a        b',
      'xddddddddz',
    ],
]

const spawn = (p) => {
    const object = add([
        sprite('kaboom'), 
        pos(p), 
        'kaboom'])

        wait(1, () => {
            destroy(object)
        })
}

scene("game", ({level, score}) => {

    layers(['bg', 'obj', 'ui'], 'obj')

    const levelCfg = {
        width: 48,
        height: 48,
        a: [sprite('left-wall'), solid(), 'wall'],
        b: [sprite('right-wall'), solid(), 'wall'],
        c: [sprite('top-wall'), solid(), 'wall'],
        d: [sprite('bottom-wall'), solid(), 'wall'],
        w: [sprite('top-right-wall'), solid(), 'wall'],
        x: [sprite('bottom-left-wall'), solid(), 'wall'],
        y: [sprite('top-left-wall'), solid(), 'wall'],
        z: [sprite('bottom-right-wall'), solid(), 'wall'],
        '%': [sprite('left-door'), solid(), 'door'],
        '^': [sprite('top-door'), 'next-level'],
        $: [sprite('stairs'), 'next-level'],
        '*': [sprite('slicer'), 'slicer', { dir: -1 }, 'dangerous'],
        '}': [sprite('skeletor'), 'dangerous', 'skeletor', { dir: -1, timer: 0 }],
        ')': [sprite('lanterns'), solid()],
        '(': [sprite('fire-pot'), solid()],
    };

    addLevel(maps[level], levelCfg);

    add([sprite('bg'), layer('bg')])

    const scoreLabel = add([
        text(`score:${score}`),
        pos(370, 490),
        scale(2)
    ])

    add([
        text(`level:${level + 1}`),
        pos(370, 515),
        scale(2)
    ])

    const player = add([
        sprite('link-going-right'),
        pos(5, 190),
        {
            dir: vec2(1,0)
        }
    ])

    player.action(() => {
        player.resolve();
    })

    player.overlaps('next-level', () => {
        go('game', { 
            level: (level + 1) % maps.length,
            score: score,
        })
    })

    keyDown('left', () => {
        player.changeSprite('link-going-left');
        player.move(-MOVE_SPEED, 0);
        player.dir = vec2(-1,0);
    })
    keyDown('right', () => {
        player.changeSprite('link-going-right');
        player.move(MOVE_SPEED, 0);
        player.dir = vec2(1,0);
    })
    keyDown('up', () => {
        player.changeSprite('link-going-up');
        player.move(0, -MOVE_SPEED);
        player.dir = vec2(0, -1);
    })
    keyDown('down', () => {
        player.changeSprite('link-going-down');
        player.move(0, MOVE_SPEED);
        player.dir = vec2(0, 1);
    })
    keyDown('space', () => {
        spawn(player.pos.add(player.dir.scale(48)))
    })

    action('slicer', (s) => {
        s.move(s.dir * SLICER_SPEED, 0);
    })

    action('skeletor', (s) => {
        s.move(0, s.dir * SKELETOR_SPEED);
        s.timer -= dt();
            if (s.timer <= 0) {
                s.dir = -s.dir;
                s.timer = rand(5)
            }
    })

    collides('kaboom', 'dangerous', (k, s) => {
        camShake(4),
        wait(1, () => {
            destroy(k)
        })
        destroy(s);
        score++;
        scoreLabel.text = `score:${score}`;
    })

    collides('dangerous', 'wall', (s) => {
        s.dir = -s.dir
    })

    player.overlaps('dangerous', () => {
        go('lose', { score })
    })
})

scene('lose', ({score}) => {
    add([
        text(`score:${score}`),
        origin('center'),
        pos(width()/2, height()/2),
        scale(2)
    ])
})

start("game", { level: 0, score: 0});