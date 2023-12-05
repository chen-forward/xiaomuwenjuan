import React, { FC, useRef, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Space, Button, Typography, Input, Tooltip, message, Popover } from "antd"
import type { InputRef } from "antd"
import { LeftOutlined, CopyOutlined, QrcodeOutlined } from "@ant-design/icons"
import QRCode from "qrcode.react"
import useGetPageInfo from "../../../hooks/useGetPageInfo"
import styles from "./StatHeader.module.scss"

const { Title } = Typography

const StatHeader: FC = () => {
  const nav = useNavigate()
  const { id } = useParams()

  const { title, isPublished } = useGetPageInfo()

  // 拷贝链接
  const urlInputRef = useRef<InputRef>(null)
  function copy() {
    const elem = urlInputRef.current
    if (elem == null) return
    elem.select() // 选中input的内容
    document.execCommand("copy") // 拷贝选中内容
    message.success("拷贝成功")
  }

  // function genLinkAndQRcodeElem() {
  //   if (!isPublished) return null

  //   // 拼接url，需要参考c端的规则
  //   const url = `http://localhost:3000/question/${id}`

  //   // 根据url生成二维码
  //   const QRCodeElem = (
  //     <div style={{ textAlign: "center" }}>
  //       <QRCode value={url} size={150} />
  //     </div>
  //   )

  //   return (
  //     <Space>
  //       <Input ref={urlInputRef} value={url} style={{ width: "300px" }} />
  //       <Tooltip title="拷贝链接">
  //         <Button icon={<CopyOutlined />} onClick={copy}></Button>
  //       </Tooltip>
  //       <Popover content={QRCodeElem}>
  //         <Button icon={<QrcodeOutlined />}></Button>
  //       </Popover>
  //     </Space>
  //   )
  // }

  // 使用useMemo的条件， 1.依赖项是否经常变化，经常变化没必要缓存意义不大 2.缓存的元素创建成本是否较高
  const LinkAndQRcodeElem = useMemo(() => {
    if (!isPublished) return null

    // 拼接url，需要参考c端的规则
    const url = `http://localhost:3000/question/${id}`

    // 根据url生成二维码
    const QRCodeElem = (
      <div style={{ textAlign: "center" }}>
        <QRCode value={url} size={150} />
      </div>
    )

    return (
      <Space>
        <Input ref={urlInputRef} value={url} style={{ width: "300px" }} />
        <Tooltip title="拷贝链接">
          <Button icon={<CopyOutlined />} onClick={copy}></Button>
        </Tooltip>
        <Popover content={QRCodeElem}>
          <Button icon={<QrcodeOutlined />}></Button>
        </Popover>
      </Space>
    )
  }, [id, isPublished])

  return (
    <div className={styles["header-wrapper"]}>
      <div className={styles.header}>
        <div className={styles.left}>
          <Space>
            <Button type="link" icon={<LeftOutlined />} onClick={() => nav(-1)}>
              返回
            </Button>
            <Title>{title}</Title>
          </Space>
        </div>
        <div className={styles.main}>{LinkAndQRcodeElem}</div>
        <div className={styles.right}>
          <Button type="primary" onClick={() => nav(`/question/edit/${id}`)}>
            编辑问卷
          </Button>
        </div>
      </div>
    </div>
  )
}

export default StatHeader
