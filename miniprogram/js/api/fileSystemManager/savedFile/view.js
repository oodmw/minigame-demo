import { p_button, p_text, p_line, p_box, p_img, p_scroll, p_goBackBtn } from '../../../libs/component/index';
import dateFormat from '../../../libs/dateFormat';
module.exports = function(PIXI, app, obj, callBack) {
    let container = new PIXI.Container(),
        goBack = p_goBackBtn(PIXI, 'delPage'),
        title = p_text(PIXI, {
            content: '本地缓存文件',
            fontSize: 36 * PIXI.ratio,
            fill: 0x353535,
            y: 52 * Math.ceil(PIXI.ratio) + 22 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        api_name = p_text(PIXI, {
            content: 'get/remove/SavedFile(List?)',
            fontSize: 32 * PIXI.ratio,
            fill: 0xbebebe,
            y: title.height + title.y + 78 * PIXI.ratio,
            relative_middle: { containerWidth: obj.width }
        }),
        underline = p_line(
            PIXI,
            {
                width: PIXI.ratio | 0,
                color: 0xd8d8d8
            },
            [(obj.width - 150 * PIXI.ratio) / 2, api_name.y + api_name.height + 23 * PIXI.ratio],
            [150 * PIXI.ratio, 0]
        ),
        scroll = p_scroll(PIXI, {
            height: 700 * PIXI.ratio,
            y: underline.height + underline.y + 78 * PIXI.ratio
        }),
        getSavedFileListButton = p_button(PIXI, {
            width: 580 * PIXI.ratio,
            y: underline.height + underline.y + 89 * PIXI.ratio
        }),
        logo = p_img(PIXI, {
            width: 36 * PIXI.ratio,
            height: 36 * PIXI.ratio,
            x: 294 * PIXI.ratio,
            y: obj.height - 66 * PIXI.ratio,
            src: 'images/logo.png'
        }),
        logoName = p_text(PIXI, {
            content: '小游戏示例',
            fontSize: 26 * PIXI.ratio,
            fill: 0x576b95,
            y: (obj.height - 62 * PIXI.ratio) | 0,
            relative_middle: { point: 404 * PIXI.ratio }
        }),
        removeSavedFileButton;

    function showListFn(paperFile) {
        let div,
            divDeploy = {
                height: 0,
                border: { width: PIXI.ratio | 0, color: 0xe5e5e5 }
            },
            div_child_arr = [],
            infoMapping = {
                filePath: {
                    name: '文件路径',
                    func(path, arr, index) {
                        path = p_text(PIXI, {
                            content: path,
                            fontSize: 30 * PIXI.ratio,
                            lineHeight: 40 * PIXI.ratio,
                            x: 200 * PIXI.ratio,
                            y: arr[index].y
                        });
                        let boxWidth = 500 * PIXI.ratio,
                            textWidth = path.width;
                        if (textWidth > boxWidth) {
                            let textArr = [],
                                text = path.text,
                                len = path.text.length,
                                fontWidth = 0,
                                startValue = 0,
                                endValue = 0;

                            path.text = text[0];
                            fontWidth = path.width;

                            for (let i = 0, num = ~~(textWidth / boxWidth); i <= num; i++) {
                                let width = 0;
                                while (width < boxWidth) {
                                    endValue += ~~((boxWidth - width) / fontWidth) || 1;
                                    if (len <= endValue) {
                                        endValue++;
                                        break;
                                    }

                                    path.text = text.slice(startValue, endValue);
                                    width = path.width;
                                }
                                endValue--;
                                textArr.push(text.slice(startValue, endValue));
                                if (len <= endValue) break;
                                startValue = endValue;
                            }
                            path.turnText(textArr.join('\n'));
                        }
                        arr.push(path);
                    }
                },
                size: {
                    name: '文件大小',
                    func(size, arr, index) {
                        arr.push(
                            p_text(PIXI, {
                                content: `${size}B`,
                                fontSize: 30 * PIXI.ratio,
                                lineHeight: 40 * PIXI.ratio,
                                x: 200 * PIXI.ratio,
                                y: arr[index + 1].y
                            })
                        );
                    }
                },
                createTime: {
                    name: '储存时间',
                    func(time, arr, index) {
                        arr.push(
                            p_text(PIXI, {
                                content: dateFormat(new Date(time), 'yyyy-MM-dd hh:mm:ss'),
                                fontSize: 30 * PIXI.ratio,
                                lineHeight: 40 * PIXI.ratio,
                                x: 200 * PIXI.ratio,
                                y: arr[index + 1].y
                            })
                        );
                    }
                }
            };

        for (let i = 0, len = paperFile.length; i < len; i++) {
            let storageTextArr = [],
                lineHeight = 15 * PIXI.ratio,
                lastOne;
            for (let j = 0, arr = Object.keys(paperFile[i]), len = arr.length; j < len; j++) {
                let index = j ? j * 2 - 1 : 0;
                storageTextArr.push(
                    p_text(PIXI, {
                        content: infoMapping[arr[j]].name,
                        fontSize: 30 * PIXI.ratio,
                        x: 30 * PIXI.ratio,
                        y: j ? storageTextArr[index].y + storageTextArr[index].height + lineHeight : lineHeight
                    })
                );
                infoMapping[arr[j]].func(paperFile[i][arr[j]], storageTextArr, index);
            }
            lastOne = storageTextArr[storageTextArr.length - 1];
            div_child_arr[i] = p_box(PIXI, {
                height: lastOne.height + lastOne.y + lineHeight / 2,
                border: {
                    width: PIXI.ratio | 0,
                    color: 0xe5e5e5
                },
                y: i ? div_child_arr[i - 1].height + div_child_arr[i - 1].y - (PIXI.ratio | 0) : 0
            });

            div_child_arr[i].addChild(...storageTextArr);
        }

        divDeploy.height = div_child_arr[div_child_arr.length - 1].y + div_child_arr[div_child_arr.length - 1].height;

        div = p_box(PIXI, divDeploy);
        div.addChild(...div_child_arr);
        scroll.myAddChildFn([div]);
        let whoHigh = div.height > scroll.height;
        scroll.isTouchable(whoHigh);

        removeSavedFileButton = p_button(PIXI, {
            width: 576 * PIXI.ratio,
            height: 90 * PIXI.ratio,
            border: { width: 2 * PIXI.ratio, color: 0xd1d1d1 },
            alpha: 0,
            y: (whoHigh ? scroll : div).height + scroll.y + 69 * PIXI.ratio
        });

        // 清空本地缓存文件列表 “按钮” 开始
        removeSavedFileButton.myAddChildFn(
            p_text(PIXI, {
                content: '清空本地缓存文件列表',
                fontSize: 36 * PIXI.ratio,
                fill: 0x53535f,
                relative_middle: {
                    containerWidth: removeSavedFileButton.width,
                    containerHeight: removeSavedFileButton.height
                }
            })
        );
        removeSavedFileButton.onClickFn(() => {
            callBack({
                status: 'removeSavedFile',
                paperFile,
                drawFn() {
                    container.removeChild(scroll).destroy(true);
                    container.removeChild(removeSavedFileButton).destroy(true);
                    getSavedFileListButton.showFn();
                }
            });
        });
        // 清空本地缓存文件列表 “按钮” 结束

        container.addChild(scroll, removeSavedFileButton);
    }

    // 获取本地缓存文件列表 “按钮” 开始
    getSavedFileListButton.myAddChildFn(
        p_text(PIXI, {
            content: '获取本地缓存文件列表',
            fontSize: 36 * PIXI.ratio,
            fill: 0xffffff,
            relative_middle: {
                containerWidth: getSavedFileListButton.width,
                containerHeight: getSavedFileListButton.height
            }
        })
    );
    getSavedFileListButton.onClickFn(() => {
        callBack({
            status: 'getSavedFileList',
            drawFn(arr) {
                showListFn(arr);
                getSavedFileListButton.hideFn();
            }
        });
    });
    // 获取本地缓存文件列表 “按钮” 结束

    container.addChild(goBack, title, api_name, underline, getSavedFileListButton, logo, logoName);
    app.stage.addChild(container);

    return container;
};
